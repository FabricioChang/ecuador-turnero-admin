import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";
import { useToast } from "@/hooks/use-toast";

interface CreateUsuarioData {
  email: string;
  nombre: string;
  password: string;
  rolId?: string;
}

interface UpdateUsuarioData {
  usuarioId: string;
  miembroId: string;
  email?: string;
  nombre?: string;
  password?: string;
  estado?: string;
  superAdmin?: boolean;
  rolIds?: string[];
}

export const useCreateUsuario = () => {
  const queryClient = useQueryClient();
  const { cuenta } = useCuenta();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateUsuarioData) => {
      if (!cuenta?.id) throw new Error("No hay cuenta seleccionada");

      // First check if user already exists
      const { data: existingUser } = await (supabaseExternal as any)
        .from("usuario_admin")
        .select("id")
        .eq("email", data.email)
        .maybeSingle();

      let usuarioId: string;

      if (existingUser?.id) {
        usuarioId = existingUser.id;
      } else {
        // Create new usuario_admin
        const { data: newUser, error: userError } = await (supabaseExternal as any)
          .from("usuario_admin")
          .insert({
            email: data.email,
            nombre: data.nombre,
            pass_hash: data.password,
            super_admin: false,
          })
          .select("id")
          .single();

        if (userError) throw userError;
        usuarioId = newUser.id;
      }

      // Check if user is already a member of this account
      const { data: existingMember } = await supabaseExternal
        .from("miembro_cuenta")
        .select("id")
        .eq("usuario_id", usuarioId)
        .eq("cuenta_id", cuenta.id)
        .maybeSingle();

      if (existingMember) {
        throw new Error("Este usuario ya es miembro de la cuenta");
      }

      // Add user as member of the account
      const { data: newMember, error: memberError } = await (supabaseExternal as any)
        .from("miembro_cuenta")
        .insert({
          usuario_id: usuarioId,
          cuenta_id: cuenta.id,
          estado: "activo",
        })
        .select("id")
        .single();

      if (memberError) throw memberError;

      // If a role was provided, assign it
      if (data.rolId && newMember?.id) {
        await (supabaseExternal as any)
          .from("usuario_rol")
          .insert({
            miembro_id: newMember.id,
            rol_id: data.rolId,
          });
      }

      return { usuarioId, miembroId: newMember?.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios_miembros"] });
    },
  });
};

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: UpdateUsuarioData) => {
      // Update usuario_admin if needed
      const updateFields: Record<string, any> = {};
      if (data.email !== undefined) updateFields.email = data.email;
      if (data.nombre !== undefined) updateFields.nombre = data.nombre;
      if (data.password) updateFields.pass_hash = data.password;
      if (data.superAdmin !== undefined) updateFields.super_admin = data.superAdmin;

      if (Object.keys(updateFields).length > 0) {
        const { error: updateError } = await (supabaseExternal as any)
          .from("usuario_admin")
          .update(updateFields)
          .eq("id", data.usuarioId);

        if (updateError) throw updateError;
      }

      // Update miembro_cuenta estado if needed
      if (data.estado !== undefined) {
        const { error: estadoError } = await (supabaseExternal as any)
          .from("miembro_cuenta")
          .update({ estado: data.estado })
          .eq("id", data.miembroId);

        if (estadoError) throw estadoError;
      }

      // Update roles if provided
      if (data.rolIds !== undefined) {
        // Delete existing roles
        await (supabaseExternal as any)
          .from("usuario_rol")
          .delete()
          .eq("miembro_id", data.miembroId);

        // Insert new roles
        if (data.rolIds.length > 0) {
          const rolInserts = data.rolIds.map(rolId => ({
            miembro_id: data.miembroId,
            rol_id: rolId,
          }));

          const { error: rolError } = await (supabaseExternal as any)
            .from("usuario_rol")
            .insert(rolInserts);

          if (rolError) throw rolError;
        }
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios_miembros"] });
      toast({
        title: "Usuario actualizado",
        description: "Los datos del usuario han sido actualizados correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteUsuarioMiembro = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (miembroId: string) => {
      // First delete user roles
      await (supabaseExternal as any)
        .from("usuario_rol")
        .delete()
        .eq("miembro_id", miembroId);

      // Then delete the member
      const { error } = await (supabaseExternal as any)
        .from("miembro_cuenta")
        .delete()
        .eq("id", miembroId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios_miembros"] });
    },
  });
};

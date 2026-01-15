import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseExternal } from "@/lib/supabase-external";
import { useCuenta } from "@/contexts/CuentaContext";

interface CreateUsuarioData {
  email: string;
  nombre: string;
  password: string;
}

export const useCreateUsuario = () => {
  const queryClient = useQueryClient();
  const { cuenta } = useCuenta();

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
            pass_hash: data.password, // In production, this should be hashed server-side
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
      const { error: memberError } = await (supabaseExternal as any)
        .from("miembro_cuenta")
        .insert({
          usuario_id: usuarioId,
          cuenta_id: cuenta.id,
          estado: "activo",
        });

      if (memberError) throw memberError;

      return { usuarioId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios_miembros"] });
    },
  });
};

export const useDeleteUsuarioMiembro = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (miembroId: string) => {
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

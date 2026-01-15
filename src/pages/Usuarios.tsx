import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search } from "lucide-react";
import { useUsuarios } from "@/hooks/useUsuarios";

export default function Usuarios() {
  const { data: usuariosDB = [], isLoading } = useUsuarios();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => { document.title = "Usuarios administrativos | Panel"; }, []);

  const usuariosFiltrados = usuariosDB.filter((usuario: any) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return usuario.email?.toLowerCase().includes(searchLower) || usuario.nombre?.toLowerCase().includes(searchLower);
  });

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
        <Button onClick={() => toast({ title: "Próximamente", description: "Crear usuario" })}>
          <Plus className="mr-2 h-4 w-4" />Nuevo usuario
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por email o nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Super Admin</TableHead>
                <TableHead>Creado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center">Cargando...</TableCell></TableRow>
              ) : usuariosFiltrados.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center">No se encontraron usuarios</TableCell></TableRow>
              ) : (
                usuariosFiltrados.map((usuario: any) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.nombre || "—"}</TableCell>
                    <TableCell>{usuario.super_admin ? "Sí" : "No"}</TableCell>
                    <TableCell>{new Date(usuario.creado_en).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

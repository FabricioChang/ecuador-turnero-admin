import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

 type Report = {
  id: string;
  fecha: string;
  descripcion: string;
  estado: "pendiente" | "resuelto";
};

const sampleReports: Report[] = [
  {
    id: "R-001",
    fecha: "2025-07-22",
    descripcion: "Los kioskos no muestran los turnos asignados en la mañana.",
    estado: "pendiente",
  },
  {
    id: "R-002",
    fecha: "2025-07-18",
    descripcion: "Error intermitente al cargar el panel de pantallas.",
    estado: "resuelto",
  },
  {
    id: "R-003",
    fecha: "2025-07-10",
    descripcion: "Demora en la actualización del estado de los turnos.",
    estado: "resuelto",
  },
];

const Soporte: React.FC = () => {
  const { toast } = useToast();
  const [descripcion, setDescripcion] = React.useState("");

  React.useEffect(() => {
    // SEO: título, meta descripción y canonical
    document.title = "Soporte | Sistema Turnero";
    const metaDesc =
      "Reporta problemas y consulta el historial de tickets de soporte.";
    let meta = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = metaDesc;

    const canonicalHref = `${window.location.origin}/soporte`;
    let link = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalHref;
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim()) {
      toast({
        title: "Validación",
        description: "Debes completar la descripción del problema.",
      });
      return;
    }

    toast({
      title: "Enviado",
      description:
        "Reporte enviado correctamente. Se ha generado un ticket de seguimiento.",
    });
    setDescripcion("");
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Soporte</h1>
        <p className="text-sm text-muted-foreground">
          Describe detalladamente el problema para que el equipo de soporte pueda ayudarte
        </p>
      </header>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Reporte de problema</CardTitle>
            <CardDescription>
              Completa el formulario con la mayor cantidad de detalles posible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción del problema</Label>
                <Textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Escribe aquí la descripción del problema..."
                  className="min-h-[120px]"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Enviar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Historial de reportes</CardTitle>
            <CardDescription>Listado simulado de reportes recientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleReports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.id}</TableCell>
                      <TableCell>{r.fecha}</TableCell>
                      <TableCell className="max-w-[520px]">{r.descripcion}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={r.estado === "resuelto" ? "secondary" : "outline"}>
                          {r.estado === "resuelto" ? "Resuelto" : "Pendiente"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Soporte;

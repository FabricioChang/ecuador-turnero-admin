import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Sucursales from "./pages/Sucursales";
import NuevaSucursal from "./pages/NuevaSucursal";
import SucursalDetalles from "./pages/SucursalDetalles";
import SucursalConfiguracion from "./pages/SucursalConfiguracion";
import Categorias from "./pages/Categorias";
import NuevaCategoria from "./pages/NuevaCategoria";
import CategoriaDetalles from "./pages/CategoriaDetalles";
import CategoriaConfiguracion from "./pages/CategoriaConfiguracion";
import Kioskos from "./pages/Kioskos";
import RegistrarKiosko from "./pages/RegistrarKiosko";
import Publicidad from "./pages/Publicidad";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import { 
  FolderOpen, 
  Clock, 
  BarChart3 
} from "lucide-react";
import Pantallas from "./pages/Pantallas";
import RegistrarPantalla from "./pages/RegistrarPantalla";
import Usuarios from "./pages/Usuarios";
import Roles from "./pages/Roles";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Configuracion from "./pages/Configuracion";
import Soporte from "./pages/Soporte";
import Reportes from "./pages/Reportes";
import Turnos from "./pages/Turnos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Páginas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Panel de administración */}
          <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/sucursales" element={<AdminLayout><Sucursales /></AdminLayout>} />
          <Route path="/sucursales/nueva" element={<AdminLayout><NuevaSucursal /></AdminLayout>} />
          <Route path="/sucursales/:id/detalles" element={<AdminLayout><SucursalDetalles /></AdminLayout>} />
          <Route path="/sucursales/:id/configurar" element={<AdminLayout><SucursalConfiguracion /></AdminLayout>} />
          <Route path="/categorias" element={<AdminLayout><Categorias /></AdminLayout>} />
          <Route path="/categorias/nueva" element={<AdminLayout><NuevaCategoria /></AdminLayout>} />
          <Route path="/categorias/:id/detalles" element={<AdminLayout><CategoriaDetalles /></AdminLayout>} />
          <Route path="/categorias/:id/configurar" element={<AdminLayout><CategoriaConfiguracion /></AdminLayout>} />
          <Route path="/kioskos" element={<AdminLayout><Kioskos /></AdminLayout>} />
          <Route path="/kioskos/registrar" element={<AdminLayout><RegistrarKiosko /></AdminLayout>} />
          <Route path="/publicidad" element={<AdminLayout><Publicidad /></AdminLayout>} />
          <Route path="/pantallas" element={<AdminLayout><Pantallas /></AdminLayout>} />
          <Route path="/pantallas/nueva" element={<AdminLayout><RegistrarPantalla /></AdminLayout>} />
          <Route path="/usuarios" element={<AdminLayout><Usuarios /></AdminLayout>} />
          <Route path="/roles" element={<AdminLayout><Roles /></AdminLayout>} />
          <Route path="/turnos" element={<AdminLayout><Turnos /></AdminLayout>} />
          <Route path="/reportes" element={<AdminLayout><Reportes /></AdminLayout>} />
          <Route path="/soporte" element={<AdminLayout><Soporte /></AdminLayout>} />
          <Route path="/configuracion" element={<AdminLayout><Configuracion /></AdminLayout>} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

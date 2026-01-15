import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CuentaProvider, useCuenta } from "@/contexts/CuentaContext";
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
import NotFound from "./pages/NotFound";
import Pantallas from "./pages/Pantallas";
import RegistrarPantalla from "./pages/RegistrarPantalla";
import Usuarios from "./pages/Usuarios";
import Roles from "./pages/Roles";
import Login from "./pages/Login";
import Configuracion from "./pages/Configuracion";
import Soporte from "./pages/Soporte";
import Reportes from "./pages/Reportes";
import Turnos from "./pages/Turnos";

const queryClient = new QueryClient();

// Componente para proteger rutas que requieren cuenta
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { cuenta, usuario, isLoading } = useCuenta();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }
  
  if (!cuenta || !usuario) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Páginas públicas */}
    <Route path="/login" element={<Login />} />

    {/* Panel de administración - Rutas protegidas */}
    <Route path="/" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
    <Route path="/sucursales" element={<ProtectedRoute><AdminLayout><Sucursales /></AdminLayout></ProtectedRoute>} />
    <Route path="/sucursales/nueva" element={<ProtectedRoute><AdminLayout><NuevaSucursal /></AdminLayout></ProtectedRoute>} />
    <Route path="/sucursales/:id/detalles" element={<ProtectedRoute><AdminLayout><SucursalDetalles /></AdminLayout></ProtectedRoute>} />
    <Route path="/sucursales/:id/configurar" element={<ProtectedRoute><AdminLayout><SucursalConfiguracion /></AdminLayout></ProtectedRoute>} />
    <Route path="/categorias" element={<ProtectedRoute><AdminLayout><Categorias /></AdminLayout></ProtectedRoute>} />
    <Route path="/categorias/nueva" element={<ProtectedRoute><AdminLayout><NuevaCategoria /></AdminLayout></ProtectedRoute>} />
    <Route path="/categorias/:id/detalles" element={<ProtectedRoute><AdminLayout><CategoriaDetalles /></AdminLayout></ProtectedRoute>} />
    <Route path="/categorias/:id/configurar" element={<ProtectedRoute><AdminLayout><CategoriaConfiguracion /></AdminLayout></ProtectedRoute>} />
    <Route path="/kioskos" element={<ProtectedRoute><AdminLayout><Kioskos /></AdminLayout></ProtectedRoute>} />
    <Route path="/kioskos/registrar" element={<ProtectedRoute><AdminLayout><RegistrarKiosko /></AdminLayout></ProtectedRoute>} />
    <Route path="/publicidad" element={<ProtectedRoute><AdminLayout><Publicidad /></AdminLayout></ProtectedRoute>} />
    <Route path="/pantallas" element={<ProtectedRoute><AdminLayout><Pantallas /></AdminLayout></ProtectedRoute>} />
    <Route path="/pantallas/nueva" element={<ProtectedRoute><AdminLayout><RegistrarPantalla /></AdminLayout></ProtectedRoute>} />
    <Route path="/usuarios" element={<ProtectedRoute><AdminLayout><Usuarios /></AdminLayout></ProtectedRoute>} />
    <Route path="/roles" element={<ProtectedRoute><AdminLayout><Roles /></AdminLayout></ProtectedRoute>} />
    <Route path="/turnos" element={<ProtectedRoute><AdminLayout><Turnos /></AdminLayout></ProtectedRoute>} />
    <Route path="/reportes" element={<ProtectedRoute><AdminLayout><Reportes /></AdminLayout></ProtectedRoute>} />
    <Route path="/soporte" element={<ProtectedRoute><AdminLayout><Soporte /></AdminLayout></ProtectedRoute>} />
    <Route path="/configuracion" element={<ProtectedRoute><AdminLayout><Configuracion /></AdminLayout></ProtectedRoute>} />

    {/* Catch-all */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CuentaProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </CuentaProvider>
  </QueryClientProvider>
);

export default App;

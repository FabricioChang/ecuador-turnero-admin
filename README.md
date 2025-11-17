# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/68cfc65f-f224-4761-beb0-68d84621d5ee

# 📋 Sistema Administrativo - Turnero SACODE

Este repositorio contiene el sistema administrativo para la gestión de turnos y recursos del **Sistema Turnero SACODE**.  
Permite a los administradores gestionar sucursales, kioskos, pantallas, categorías, usuarios, publicidad, reportes y reglas de atención, así como brindar una experiencia fluida a los clientes.

---

## 🚀 Características principales

### 🔑 Autenticación y Seguridad
- Configuración de contraseña y datos personales al primer ingreso.
- Edición de perfil, correo y credenciales de acceso.

### 🏢 Gestión de Sucursales y Recursos
- Creación y edición de **sucursales** con nombre, dirección, horarios y zona.
- Registro de **categorías** de atención con nombre, código y color.
- Alta de **kioskos** asociados a sucursales.
- Registro de **pantallas** para mostrar turnos y anuncios.
- Carga y administración de **contenido publicitario** (imágenes, videos).

### 👥 Administración de Usuarios
- Creación de cuentas para **usuarios administrativos** (técnicos, gerentes, etc.).
- Asignación de usuarios a sucursales.
- Configuración de **permisos específicos** por usuario.
- Validación de correos, roles y duplicidad de registros.

### 🔗 Asignación de Recursos
- Asignar kioskos, pantallas y categorías a sucursales.
- Reglas para evitar duplicidades y conflictos de asignación.

### ⚙️ Configuración Avanzada
- Definir **campos requeridos** en kioskos (cédula, teléfono, nombre).
- Configurar **reglas de prioridad** entre categorías.
- Definir **tiempos de recuperación** de turnos perdidos.

### 📊 Reportes y Soporte
- Generar y exportar **reportes** filtrados por fecha, categoría y sucursal.
- Reporte de errores técnicos o funcionales al equipo de soporte.

### 🧾 Funcionalidad para Clientes
- Generación de turnos desde kioskos con impresión de ticket y código QR.
- Consulta de estado de turno desde móvil o web.
- Recepción de notificaciones web cuando se acerque el turno.
- Visualización de tiempo estimado en pantallas.
- Atención prioritaria para clientes vulnerables.

---

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


# InventarioLab 🧪

Sistema de gestión de inventario para laboratorios. Aplicación web para controlar equipos, reactivos, movimientos y generar reportes.

## 📋 Descripción

**InventarioLab** es una aplicación Angular 18 que permite gestionar el inventario de un laboratorio incluyendo:

- **Equipos**: Registrar y mantener equipos de laboratorio
- **Reactivos**: Gestionar reactivos químicos y sus características
- **Categorías**: Organizar equipos y reactivos por categorías
- **Movimientos**: Registrar entradas, salidas y transferencias
- **Mantenimiento**: Controlar mantenimiento preventivo de equipos
- **Reportes**: Generar reportes sobre el estado del inventario
- **Usuarios**: Administrar usuarios con control de roles
- **Autenticación**: Sistema de login con roles y permisos

## 🛠️ Stack Tecnológico

- **Framework**: Angular 18
- **Lenguaje**: TypeScript 5.5
- **Estilos**: SCSS
- **Testing**: Jasmine + Karma
- **Gráficas**: Chart.js
- **Reportes PDF**: jsPDF + jsPDF-AutoTable
- **Build**: ng build / pnpm

## 🚀 Instalación y Desarrollo

### Requisitos

- Node.js 18+ o superior
- pnpm (o npm)

### Instalación

```bash
# Clonar el repositorio
git clone <repo>
cd InventarioLab

# Instalar dependencias
pnpm install
```

### Desarrollo

```bash
# Servidor de desarrollo
pnpm run start
# Navega a http://localhost:4200/
```

### Build

```bash
# Compilar para producción
pnpm run build
# Los archivos se generan en dist/inventario-lab/browser
```

### Testing

```bash
# Ejecutar tests unitarios
pnpm run test
```

## 🐳 Docker

Construir y ejecutar la aplicación en Docker:

```bash
# Construir imagen
docker build -t inventariolab .

# Ejecutar contenedor
docker run --rm -p 8080:80 inventariolab

# Acceder en http://localhost:8080
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── business/              # Módulos de negocio
│   │   ├── authentication/    # Login y reset de contraseña
│   │   ├── equipos/           # Gestión de equipos
│   │   ├── reactivos/         # Gestión de reactivos
│   │   ├── categorias/        # Gestión de categorías
│   │   ├── usuarios/          # Gestión de usuarios
│   │   ├── movimientos/       # Registro de movimientos
│   │   ├── reportes/          # Generación de reportes
│   │   ├── mantenimiento/     # Control de mantenimiento
│   │   └── config/            # Configuración general
│   ├── core/
│   │   ├── guards/            # Guardias de rutas (auth, role)
│   │   ├── services/          # Servicios de API
│   │   └── models/            # Interfaces de datos
│   ├── shared/
│   │   └── components/        # Componentes compartidos (layout, navbar)
│   └── app.routes.ts          # Rutas principales
├── environments/              # Configuración por entorno
└── styles.scss               # Estilos globales
```

## 🔐 Seguridad

- Guardias de ruta para autenticación
- Control de roles y permisos
- Auto-refresh de tokens
- Login obligatorio (excepto en /login)

## 📝 Comandos Disponibles

| Comando          | Descripción                   |
| ---------------- | ----------------------------- |
| `pnpm run start` | Inicia servidor de desarrollo |
| `pnpm run build` | Compila para producción       |
| `pnpm run test`  | Ejecuta tests unitarios       |
| `pnpm run watch` | Compila en modo watch         |

## 📦 Dependencias Principales

- `@angular/*` - Framework Angular
- `rxjs` - Programación reactiva
- `chart.js` - Gráficas
- `jspdf` - Generación de PDFs

## 📄 Licencia

MIT

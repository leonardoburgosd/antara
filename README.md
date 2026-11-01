# Antara - Multi-Platform Music Streaming

Antara es una plataforma de streaming musical con múltiples interfaces para diferentes plataformas.

## Estructura del Proyecto

Este proyecto está organizado como un monorepo con las siguientes aplicaciones:

### Aplicaciones

- **`apps/mobile/`** - Aplicación móvil con Kotlin + Jetpack Compose + Media3
- **`apps/web/`** - Aplicación web con React + TypeScript + Tailwind CSS + Motion
- **`apps/desktop/`** - Aplicación de escritorio con Rust + Tauri 2 + React + TypeScript + Tailwind CSS + Motion

### Paquetes compartidos

- **`packages/shared/`** - Código compartido entre aplicaciones
- **`packages/types/`** - Tipos TypeScript compartidos

## Tecnologías

### Móvil
- Kotlin
- Jetpack Compose
- Media3 (ExoPlayer)

### Web
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion (Framer Motion)

### Escritorio
- Rust
- Tauri 2
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion (Framer Motion)

## Desarrollo

### Web
```bash
cd apps/web
npm install
npm run dev
```

### Desktop (Tauri)
```bash
cd apps/desktop
npm install
npm run tauri dev
```

### Mobile (Android)
```bash
cd apps/mobile
./gradlew assembleDebug
```

## Funcionalidades
- [x] Registro de usuario
- [x] Registro de album
- [x] Registro de canciones
- [x] Reproduccion de canciones

## Colaboradores

| Nombre                              | Github                             |
|-------------------------------------|------------------------------------|
|:sunglasses: Diego Rivasplata Guzmán | https://github.com/diegoRivasplata |
|:sunglasses: Leonardo Burgos Díaz    | https://github.com/leonardoburgosd |

## Desplegado

Próximamente: https://antara.leonardoburgosd.site

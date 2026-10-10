# Asesoría y Diseños C&M

Sitio corporativo estático preparado para Cloudflare Workers Static Assets.

## Desarrollo y validación

```bash
npm run check
npm run build
```

El build se genera en `dist/` sin dependencias externas.

## Configuración de Cloudflare Workers Builds

- Rama de producción: `main`
- Comando de build: `npm run build`
- Directorio de salida: `dist`
- Comando de despliegue: `npx wrangler deploy`
- Versión de Node.js: 18 o superior

El sitio no requiere base de datos ni servidor propio: los contactos se abren directamente en WhatsApp o correo.

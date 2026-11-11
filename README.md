# Grabado láser (Grabado Directo)

Tienda en línea para personalizar productos con grabado láser. El usuario elige un producto, escribe el texto o elige un diseño, ve una vista previa en tiempo real, lo agrega al carrito y envía su pedido.

Proyecto individual de la materia Proyecto II, hecho con React 18 y Vite 5.

## Qué incluye

- Catálogo por categoría, con buscador y orden por precio.
- Detalle del producto con personalización y vista previa del grabado.
- Carrito, checkout y aviso del pedido por correo (Formspree).
- Registro e inicio de sesión (las cuentas se guardan en el navegador).
- Formulario de cotización y galería de trabajos.
- Diseño responsivo para celular, tableta y computadora.

## Requisitos

- Node.js 18 o superior.
- npm (viene con Node.js).

## Cómo ejecutarlo

1. Clona el repositorio e instala las dependencias:

   ```bash
   git clone https://github.com/Tovanche/grabado-laser-sprint1.git
   cd grabado-laser-sprint1
   npm install
   ```

2. Copia la plantilla de variables y pon tu liga de Formspree:

   ```bash
   cp .env.example .env
   ```

   Abre `.env` y escribe tu liga después del signo igual:

   ```
   VITE_FORM_URL=https://formspree.io/f/tu_codigo
   ```

   El archivo `.env` no se sube a GitHub.

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abre la dirección que aparece en la terminal (normalmente http://localhost:5173).

## Para generar la versión final

```bash
npm run build
```

Los archivos quedan en la carpeta `dist`.

## Estructura

```
index.html        Página base
src/main.jsx      Punto de entrada de React
src/App.jsx       Vistas y lógica de la tienda
src/App.css       Estilos y diseño responsivo
.env.example      Plantilla de variables de entorno
```

## Seguimiento

- Tablero de GitHub Projects: https://github.com/users/Tovanche/projects/1

## Pendiente

Pasarela de pago, seguimiento de pedido, reseñas, copia de confirmación al cliente y panel de administración. Necesitan un servidor propio y quedan para un backlog posterior.

## Autora

Fatima Denisse Tovanche Ortega

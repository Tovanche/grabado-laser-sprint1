import { useState } from "react";

// --- HS-01: Lista de productos del catálogo ---
const productos = [
  { id: 1, nombre: "Cartera de cuero", categoria: "Carteras", precio: 590 },
  { id: 2, nombre: "Playera de algodón", categoria: "Ropa", precio: 320 },
  { id: 3, nombre: "Vaso de aluminio", categoria: "Aluminio", precio: 275 },
  { id: 4, nombre: "Vaso de cristal", categoria: "Cristal", precio: 240 },
];

// HS-01: categorías para el filtro (se sacan solas de la lista de productos)
const categorias = ["Todas", ...new Set(productos.map((p) => p.categoria))];

// HS-02: estilos de letra disponibles para el grabado
const estilosLetra = [
  { nombre: "Clásica", fuente: "Georgia, serif" },
  { nombre: "Moderna", fuente: "Arial, sans-serif" },
  { nombre: "Manuscrita", fuente: "'Brush Script MT', cursive" },
  { nombre: "Máquina de escribir", fuente: "'Courier New', monospace" },
];

// --- Menú final: actividades del curso y modificaciones realizadas ---
const actividadesCurso = [
  { fecha: "06/09/2026", nombre: "Actividad integradora: Sprint, el corazón de SCRUM", detalle: "Product Backlog inicial (14 historias), fichas y calendarización del Sprint 1." },
  { fecha: "23/09/2026", nombre: "Actividad integradora 2: El backlog y el Sprint Schedule", detalle: "Planeación del caso Sitio web de contenido educativo: 16 historias, 3 sprint y prototipo probado." },
  { fecha: "28/10/2026", nombre: "Actividad integradora. Producto final U3", detalle: "Cierre de 4 sprint: 52 de 74 puntos terminados (70 %)." },
  { fecha: "04/11/2026", nombre: "Unidad 4, Actividad 1: Reunión de revisión inicial", detalle: "Reporte de roles y 7 propuestas de modificación (P1 a P7)." },
  { fecha: "11/11/2026", nombre: "Unidad 4, Actividad 2: Reunión para revisión de modificaciones", detalle: "Se aplicaron P1, P2, P3 y P8; retrospectiva del proyecto." },
  { fecha: "23/11/2026", nombre: "Actividad final: Producto final y documentación", detalle: "Menú, sistema implementado, código fuente comprimido y reporte de modificaciones." },
];

const modificacionesRealizadas = [
  { id: "P1", texto: "Título de la página corregido a \"Grabado Láser\" (index.html).", estado: "Aplicada" },
  { id: "P2", texto: "README.md con los pasos para instalar y ejecutar el proyecto.", estado: "Aplicada" },
  { id: "P3", texto: ".env.example con la variable VITE_FORM_URL.", estado: "Aplicada" },
  { id: "P8", texto: ".gitignore para no subir node_modules, dist ni .env.", estado: "Aplicada" },
  { id: "P4", texto: "Servidor propio para cuentas, pedidos y pago (HS-05b, HS-06, HS-07, HS-14).", estado: "Backlog posterior" },
  { id: "P5", texto: "Copia de confirmación al cliente con otro servicio de correo (HS-13b).", estado: "Backlog posterior" },
  { id: "P6", texto: "Fotos de trabajos reales en la galería (HS-08).", estado: "Backlog posterior" },
  { id: "P7", texto: "Reseñas y calificaciones de clientes (HS-12).", estado: "Backlog posterior" },
];

const ligaCodigoComprimido = "https://github.com/Tovanche/grabado-laser-sprint1/archive/refs/heads/main.zip";
const ligaRepositorio = "https://github.com/Tovanche/grabado-laser-sprint1";

function fuenteDe(nombreEstilo) {
  const estilo = estilosLetra.find((e) => e.nombre === nombreEstilo);
  return estilo ? estilo.fuente : "inherit";
}

// HS-03: dibujo sencillo de cada producto (SVG) y zona donde va el grabado
const dibujosProducto = {
  "Cartera de cuero": {
    zona: { x: 150, y: 118, ancho: 150 },
    color: "#e8c9a0",
    forma: (
      <g>
        <rect x="30" y="40" width="240" height="150" rx="16" fill="#7a4a2b" />
        <rect x="40" y="50" width="220" height="130" rx="10" fill="none" stroke="#c99a6b" strokeWidth="2" strokeDasharray="6 4" />
        <rect x="30" y="40" width="240" height="26" rx="12" fill="#6a3f23" />
      </g>
    ),
  },
  "Playera de algodón": {
    zona: { x: 150, y: 105, ancho: 100 },
    color: "#2f3e5c",
    forma: (
      <path
        d="M95 30 L55 50 L30 95 L65 110 L80 90 L80 195 L220 195 L220 90 L235 110 L270 95 L245 50 L205 30 Q150 70 95 30 Z"
        fill="#f1efe9" stroke="#cfcac0" strokeWidth="2"
      />
    ),
  },
  "Vaso de aluminio": {
    zona: { x: 150, y: 115, ancho: 105 },
    color: "#3c4450",
    forma: (
      <g>
        <path d="M85 30 L215 30 L200 195 L100 195 Z" fill="#c4c9cf" stroke="#9aa1a9" strokeWidth="2" />
        <rect x="85" y="30" width="130" height="12" rx="4" fill="#aeb4bb" />
        <path d="M110 45 L118 190" stroke="#e8ebee" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      </g>
    ),
  },
  "Vaso de cristal": {
    zona: { x: 150, y: 115, ancho: 105 },
    color: "#ffffff",
    borde: "#5b8aa0",
    forma: (
      <g>
        <path d="M85 30 L215 30 L202 195 L98 195 Z" fill="#bfe3f2" fillOpacity="0.55" stroke="#8fc3d9" strokeWidth="2" />
        <path d="M110 45 L117 188" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
      </g>
    ),
  },
};

// HS-03: muestra el texto grabado encima del producto, con el estilo de letra elegido
function VistaProducto({ producto, texto, fuente }) {
  const dibujo = dibujosProducto[producto.nombre];
  if (!dibujo) return null;
  const { x, y, ancho } = dibujo.zona;
  const contenido = texto || "Tu texto aquí";
  // el tamaño baja si el texto es largo para que no se salga del producto
  const tamano = Math.max(11, Math.min(30, ancho / (contenido.length * 0.55)));
  return (
    <svg className="vista-producto" viewBox="0 0 300 220" role="img" aria-label={`Vista previa sobre ${producto.nombre}`}>
      {dibujo.forma}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fontSize={tamano}
        fill={texto ? dibujo.color : "#8a8a8a"}
        stroke={texto && dibujo.borde ? dibujo.borde : "none"}
        strokeWidth="0.6"
        opacity={texto ? 1 : 0.6}
        style={{ fontFamily: fuente }}
      >
        {contenido}
      </text>
    </svg>
  );
}

// HS-08: ejemplos de trabajos grabados para la galería
const trabajosGaleria = [
  { producto: "Cartera de cuero", texto: "Carlos R.", estilo: "Clásica" },
  { producto: "Playera de algodón", texto: "Mamá", estilo: "Manuscrita" },
  { producto: "Vaso de aluminio", texto: "Mi vaso", estilo: "Moderna" },
  { producto: "Vaso de cristal", texto: "Salud", estilo: "Máquina de escribir" },
];

// HS-10: quita acentos y mayúsculas para que la búsqueda no distinga entre "Cartera" y "cartéra"
function normalizar(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// HS-09: dirección del servicio que recibe el formulario y lo manda al correo del negocio.
// Se crea un formulario gratis en https://formspree.io y se guarda su URL en el archivo .env:
// VITE_FORM_URL=https://formspree.io/f/xxxxxxxx
const URL_FORMULARIO = import.meta.env.VITE_FORM_URL || "https://formspree.io/f/xbgdpdwq";

// HS-13: manda un mensaje al correo del negocio por medio del servicio de formularios
async function enviarAlNegocio(datos) {
  if (!URL_FORMULARIO) throw new Error("Falta la variable VITE_FORM_URL");
  const respuesta = await fetch(URL_FORMULARIO, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(datos),
  });
  if (!respuesta.ok) throw new Error("Respuesta no válida");
}

// HS-06: las cuentas se guardan en el navegador (localStorage), sin servidor.
const CLAVE_USUARIOS = "gd_usuarios";
const CLAVE_SESION = "gd_sesion";

function leerAlmacen(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : valorInicial;
  } catch (error) {
    return valorInicial;
  }
}

function guardarAlmacen(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    // si el navegador bloquea el almacenamiento, la sesión dura solo mientras la página está abierta
  }
}

// busca al usuario con sesión iniciada (si existe)
function leerSesion() {
  const correo = leerAlmacen(CLAVE_SESION, null);
  return leerAlmacen(CLAVE_USUARIOS, []).find((u) => u.correo === correo) || null;
}

// la contraseña no se guarda en texto: se guarda su huella SHA-256
async function huellaDe(texto) {
  const datos = new TextEncoder().encode(texto);
  const resumen = await crypto.subtle.digest("SHA-256", datos);
  return Array.from(new Uint8Array(resumen))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function App() {
  const [vista, setVista] = useState("catalogo");
  // Menú final: sección abierta ("actividades", "sistema", "codigo" o "reporte")
  const [seccionMenu, setSeccionMenu] = useState("actividades");

  // HS-01: categoría seleccionada en el filtro
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  // HS-10: texto de búsqueda y orden por precio
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("ninguno");

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [textoGrabado, setTextoGrabado] = useState("");

  // HS-02: estilo de letra elegido
  const [estiloLetra, setEstiloLetra] = useState(estilosLetra[0].nombre);

  const [carrito, setCarrito] = useState([]);

  // HS-09: ahora el formulario también pide la cantidad
  // HS-06: si hay una sesión iniciada, el nombre y el correo se rellenan solos
  const [formulario, setFormulario] = useState(() => {
    const sesion = leerSesion();
    return { nombre: sesion ? sesion.nombre : "", correo: sesion ? sesion.correo : "", cantidad: 1, mensaje: "" };
  });
  const [enviado, setEnviado] = useState(false);
  // HS-09: estados del envío real
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");

  // HS-05a: datos de contacto del checkout y pedido confirmado
  const [datosPedido, setDatosPedido] = useState(() => {
    const sesion = leerSesion();
    return { nombre: sesion ? sesion.nombre : "", correo: sesion ? sesion.correo : "", telefono: "", direccion: "" };
  });
  const [pedido, setPedido] = useState(null);

  // HS-13: estado del aviso de pedido por correo
  const [enviandoPedido, setEnviandoPedido] = useState(false);
  const [errorPedido, setErrorPedido] = useState("");

  // HS-06: sesión, modo de la pantalla de cuenta y sus campos
  const [usuario, setUsuario] = useState(leerSesion);
  const [modoCuenta, setModoCuenta] = useState("entrar"); // "entrar" o "registro"
  const [datosCuenta, setDatosCuenta] = useState({ nombre: "", correo: "", clave: "" });
  const [errorCuenta, setErrorCuenta] = useState("");

  // --- Funciones que puede hacer el usuario ---

  function abrirDetalle(producto) {
    setProductoSeleccionado(producto);
    setTextoGrabado("");
    setEstiloLetra(estilosLetra[0].nombre);
    setVista("detalle");
  }

  // HS-08: abre el detalle con el texto y el estilo del ejemplo elegido en la galería
  function usarDiseno(trabajo) {
    const producto = productos.find((p) => p.nombre === trabajo.producto);
    setProductoSeleccionado(producto);
    setTextoGrabado(trabajo.texto);
    setEstiloLetra(trabajo.estilo);
    setVista("detalle");
  }

  function agregarAlCarrito() {
    const nuevoItem = {
      ...productoSeleccionado,
      texto: textoGrabado || "Sin texto",
      estilo: estiloLetra,
    };
    setCarrito([...carrito, nuevoItem]);
    setVista("catalogo");
  }

  function quitarDelCarrito(index) {
    const copiaCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(copiaCarrito);
  }

  // HS-09: envía el formulario al servicio, que lo manda al correo del negocio
  async function enviarFormulario(e) {
    e.preventDefault();
    setErrorEnvio("");

    if (!URL_FORMULARIO) {
      setErrorEnvio("El envío todavía no está configurado. Falta la variable VITE_FORM_URL.");
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch(URL_FORMULARIO, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          nombre: formulario.nombre,
          email: formulario.correo, // Formspree usa "email" como correo de respuesta
          cantidad: formulario.cantidad,
          mensaje: formulario.mensaje,
        }),
      });
      if (!respuesta.ok) throw new Error("Respuesta no válida");
      setEnviado(true);
    } catch (error) {
      setErrorEnvio("No se pudo enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  // HS-05a y HS-13: confirma el pedido, avisa al negocio por correo y vacía el carrito
  async function confirmarPedido(e) {
    e.preventDefault();
    setErrorPedido("");
    const numero = "GD-" + String(Date.now()).slice(-6);
    const resumen = carrito
      .map((item) => `${item.nombre} - grabado "${item.texto}" (${item.estilo}) - $${item.precio} MXN`)
      .join("\n");

    setEnviandoPedido(true);
    try {
      await enviarAlNegocio({
        _subject: `Nuevo pedido ${numero}`,
        nombre: datosPedido.nombre,
        email: datosPedido.correo,
        telefono: datosPedido.telefono,
        direccion: datosPedido.direccion,
        pedido: resumen,
        total: `$${total} MXN`,
      });
      setPedido({ numero, items: carrito, total, datos: datosPedido });
      setCarrito([]);
    } catch (error) {
      setErrorPedido("No se pudo enviar el aviso de tu pedido al negocio. Inténtalo de nuevo; tu carrito sigue guardado.");
    } finally {
      setEnviandoPedido(false);
    }
  }

  function abrirCheckout() {
    setPedido(null);
    setErrorPedido("");
    setVista("checkout");
  }

  // HS-06: rellena los formularios con los datos de la cuenta
  function rellenarDatos(persona) {
    setFormulario((anterior) => ({ ...anterior, nombre: persona.nombre, correo: persona.correo }));
    setDatosPedido((anterior) => ({ ...anterior, nombre: persona.nombre, correo: persona.correo }));
  }

  // HS-06: crea una cuenta nueva
  async function registrarCuenta(e) {
    e.preventDefault();
    setErrorCuenta("");
    const correo = datosCuenta.correo.trim().toLowerCase();
    const usuarios = leerAlmacen(CLAVE_USUARIOS, []);

    if (usuarios.some((u) => u.correo === correo)) {
      setErrorCuenta("Ya existe una cuenta con ese correo. Inicia sesión.");
      return;
    }
    if (datosCuenta.clave.length < 6) {
      setErrorCuenta("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const nuevo = { nombre: datosCuenta.nombre.trim(), correo, huella: await huellaDe(datosCuenta.clave) };
      guardarAlmacen(CLAVE_USUARIOS, [...usuarios, nuevo]);
      guardarAlmacen(CLAVE_SESION, correo);
      setUsuario(nuevo);
      rellenarDatos(nuevo);
      setDatosCuenta({ nombre: "", correo: "", clave: "" });
    } catch (error) {
      setErrorCuenta("Tu navegador no permite crear cuentas en esta conexión.");
    }
  }

  // HS-06: inicia sesión con una cuenta existente
  async function iniciarSesion(e) {
    e.preventDefault();
    setErrorCuenta("");
    const correo = datosCuenta.correo.trim().toLowerCase();
    const encontrado = leerAlmacen(CLAVE_USUARIOS, []).find((u) => u.correo === correo);

    try {
      const huella = await huellaDe(datosCuenta.clave);
      if (!encontrado || encontrado.huella !== huella) {
        setErrorCuenta("Correo o contraseña incorrectos.");
        return;
      }
      guardarAlmacen(CLAVE_SESION, correo);
      setUsuario(encontrado);
      rellenarDatos(encontrado);
      setDatosCuenta({ nombre: "", correo: "", clave: "" });
    } catch (error) {
      setErrorCuenta("Tu navegador no permite iniciar sesión en esta conexión.");
    }
  }

  function cerrarSesion() {
    guardarAlmacen(CLAVE_SESION, null);
    setUsuario(null);
    setVista("catalogo");
  }

  const total = carrito.reduce((suma, item) => suma + item.precio, 0);

  // HS-01 y HS-10: productos que se muestran según la categoría, la búsqueda y el orden
  const productosFiltrados = productos
    .filter((producto) => categoriaActiva === "Todas" || producto.categoria === categoriaActiva)
    .filter((producto) => normalizar(producto.nombre).includes(normalizar(busqueda.trim())))
    .sort((a, b) => (orden === "menor" ? a.precio - b.precio : orden === "mayor" ? b.precio - a.precio : 0));

  // --- Lo que se dibuja en pantalla ---
  return (
    <div className="app">
      {/* Barra de navegación simple */}
      <nav className="nav">
        <button className="boton-menu" onClick={() => setVista("menu")}>☰ Menú</button>
        <button onClick={() => setVista("catalogo")}>Catálogo</button>
        <button onClick={() => setVista("carrito")}>Carrito ({carrito.length})</button>
        <button onClick={() => setVista("galeria")}>Galería</button>
        <button onClick={() => setVista("cotizacion")}>Cotización</button>
        {/* HS-06: acceso a la cuenta */}
        <button onClick={() => setVista("cuenta")}>
          {usuario ? `Hola, ${usuario.nombre.split(" ")[0]}` : "Mi cuenta"}
        </button>
      </nav>

      {/* Menú final: actividades, sistema, código fuente y reporte de modificaciones */}
      {vista === "menu" && (
        <div className="menu-final">
          <h2>Menú</h2>
          <div className="menu-opciones">
            <button className={seccionMenu === "actividades" ? "activa" : ""} onClick={() => setSeccionMenu("actividades")}>Actividades realizadas en el curso</button>
            <button className={seccionMenu === "sistema" ? "activa" : ""} onClick={() => setSeccionMenu("sistema")}>Sistema implementado</button>
            <button className={seccionMenu === "codigo" ? "activa" : ""} onClick={() => setSeccionMenu("codigo")}>Código fuente (comprimido)</button>
            <button className={seccionMenu === "reporte" ? "activa" : ""} onClick={() => setSeccionMenu("reporte")}>Reporte de las modificaciones realizadas</button>
          </div>

          {seccionMenu === "actividades" && (
            <div className="menu-contenido">
              <h3>Actividades realizadas en el curso</h3>
              <ol>
                {actividadesCurso.map((actividad) => (
                  <li key={actividad.nombre}>
                    <strong>{actividad.nombre}</strong> <span>({actividad.fecha})</span>
                    <p>{actividad.detalle}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {seccionMenu === "sistema" && (
            <div className="menu-contenido">
              <h3>Sistema implementado</h3>
              <p>Tienda en línea de productos personalizados con grabado láser, hecha con React y Vite. Terminó 11 de 16 historias (52 de 74 puntos).</p>
              <button onClick={() => setVista("catalogo")}>Abrir la tienda</button>
            </div>
          )}

          {seccionMenu === "codigo" && (
            <div className="menu-contenido">
              <h3>Código fuente (comprimido)</h3>
              <p>Descarga el código del proyecto en un archivo .zip o revisa el repositorio en GitHub.</p>
              <p>
                <a href={ligaCodigoComprimido} className="enlace-boton">Descargar código (.zip)</a>{" "}
                <a href={ligaRepositorio} className="enlace-boton" target="_blank" rel="noreferrer">Ver repositorio en GitHub</a>
              </p>
            </div>
          )}

          {seccionMenu === "reporte" && (
            <div className="menu-contenido">
              <h3>Reporte de las modificaciones realizadas</h3>
              <ul>
                {modificacionesRealizadas.map((m) => (
                  <li key={m.id}>
                    <strong>{m.id}</strong>: {m.texto} <em>({m.estado})</em>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* HS-01: Catálogo de productos con filtro por categoría */}
      {vista === "catalogo" && (
        <div>
          <h1>Grabado Directo</h1>
          <p>Elige un producto para personalizarlo con grabado láser.</p>

          <div className="filtros">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                className={categoria === categoriaActiva ? "activo" : ""}
                onClick={() => setCategoriaActiva(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>

          {/* HS-10: buscador y orden por precio */}
          <div className="buscador">
            <label>
              Buscar producto:
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Ejemplo: vaso"
              />
            </label>
            <label>
              Ordenar por precio:
              <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                <option value="ninguno">Sin orden</option>
                <option value="menor">Del más barato al más caro</option>
                <option value="mayor">Del más caro al más barato</option>
              </select>
            </label>
          </div>

          {productosFiltrados.length === 0 && <p>No encontramos productos con esa búsqueda.</p>}

          <div className="lista-productos">
            {productosFiltrados.map((producto) => (
              <div className="tarjeta" key={producto.id}>
                <h3>{producto.nombre}</h3>
                <p>{producto.categoria}</p>
                <p>${producto.precio} MXN</p>
                <button onClick={() => abrirDetalle(producto)}>Personalizar</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HS-08: Galería de ejemplos de grabado */}
      {vista === "galeria" && (
        <div>
          <h2>Galería de trabajos</h2>
          <p>Ejemplos de grabado láser. Elige uno para personalizarlo con tu propio texto.</p>
          <div className="lista-productos">
            {trabajosGaleria.map((trabajo) => (
              <div className="tarjeta" key={trabajo.producto}>
                <VistaProducto
                  producto={productos.find((p) => p.nombre === trabajo.producto)}
                  texto={trabajo.texto}
                  fuente={fuenteDe(trabajo.estilo)}
                />
                <h3>{trabajo.producto}</h3>
                <p>Estilo: {trabajo.estilo}</p>
                <button onClick={() => usarDiseno(trabajo)}>Quiero uno igual</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HS-02 y HS-03: Personalización y vista previa */}
      {vista === "detalle" && productoSeleccionado && (
        <div>
          <button onClick={() => setVista("catalogo")}>← Regresar</button>
          <h2>{productoSeleccionado.nombre}</h2>

          <label>
            Texto a grabar:
            <input
              type="text"
              value={textoGrabado}
              onChange={(e) => setTextoGrabado(e.target.value)}
              placeholder="Escribe tu texto"
            />
          </label>

          {/* HS-02: selector de estilo de letra */}
          <label>
            Estilo de letra:
            <select value={estiloLetra} onChange={(e) => setEstiloLetra(e.target.value)}>
              {estilosLetra.map((estilo) => (
                <option key={estilo.nombre} value={estilo.nombre}>
                  {estilo.nombre}
                </option>
              ))}
            </select>
          </label>

          {/* HS-03: vista previa del grabado sobre el producto */}
          <div className="vista-previa">
            <p>Vista previa del grabado sobre el producto:</p>
            <VistaProducto
              producto={productoSeleccionado}
              texto={textoGrabado}
              fuente={fuenteDe(estiloLetra)}
            />
          </div>

          <button onClick={agregarAlCarrito}>Agregar al carrito</button>
        </div>
      )}

      {/* HS-04: Carrito de compras */}
      {vista === "carrito" && (
        <div>
          <h2>Tu carrito</h2>
          {carrito.length === 0 && <p>Todavía no agregas productos.</p>}
          {carrito.map((item, index) => (
            <div className="tarjeta" key={index}>
              <p>
                {item.nombre} — grabado:{" "}
                <span style={{ fontFamily: fuenteDe(item.estilo) }}>"{item.texto}"</span>
              </p>
              <p>Estilo: {item.estilo}</p>
              <p>${item.precio} MXN</p>
              <button onClick={() => quitarDelCarrito(index)}>Quitar</button>
            </div>
          ))}
          {carrito.length > 0 && <h3>Total: ${total} MXN</h3>}
          {carrito.length > 0 && (
            <button onClick={abrirCheckout}>Continuar con la compra</button>
          )}
        </div>
      )}

      {/* HS-05a: Checkout con resumen del pedido y datos de contacto */}
      {vista === "checkout" && (
        <div>
          <h2>Resumen de tu pedido</h2>

          {pedido ? (
            <div className="tarjeta">
              <h3>¡Pedido confirmado!</h3>
              <p>Número de pedido: <strong>{pedido.numero}</strong></p>
              <p>
                Gracias, {pedido.datos.nombre}. Te contactaremos a {pedido.datos.correo} para
                coordinar el pago y la entrega.
              </p>
              <p>Total: ${pedido.total} MXN</p>
              <p>Enviamos el aviso de tu pedido por correo al negocio.</p>
              <button onClick={() => setVista("catalogo")}>Volver al catálogo</button>
            </div>
          ) : carrito.length === 0 ? (
            <p>Tu carrito está vacío. Agrega un producto desde el catálogo.</p>
          ) : (
            <div>
              {carrito.map((item, index) => (
                <div className="tarjeta" key={index}>
                  <p>
                    {item.nombre} — grabado:{" "}
                    <span style={{ fontFamily: fuenteDe(item.estilo) }}>"{item.texto}"</span>
                  </p>
                  <p>${item.precio} MXN</p>
                </div>
              ))}
              <h3>Total: ${total} MXN</h3>

              <form onSubmit={confirmarPedido}>
                <label>
                  Nombre:
                  <input
                    type="text"
                    required
                    value={datosPedido.nombre}
                    onChange={(e) => setDatosPedido({ ...datosPedido, nombre: e.target.value })}
                  />
                </label>
                <label>
                  Correo:
                  <input
                    type="email"
                    required
                    value={datosPedido.correo}
                    onChange={(e) => setDatosPedido({ ...datosPedido, correo: e.target.value })}
                  />
                </label>
                <label>
                  Teléfono:
                  <input
                    type="tel"
                    required
                    pattern="[0-9 +()-]{10,15}"
                    title="Escribe un teléfono de 10 dígitos"
                    value={datosPedido.telefono}
                    onChange={(e) => setDatosPedido({ ...datosPedido, telefono: e.target.value })}
                  />
                </label>
                <label>
                  Dirección de entrega:
                  <textarea
                    required
                    value={datosPedido.direccion}
                    onChange={(e) => setDatosPedido({ ...datosPedido, direccion: e.target.value })}
                  />
                </label>
                {errorPedido && <p className="error">{errorPedido}</p>}
                <button type="submit" disabled={enviandoPedido}>
                  {enviandoPedido ? "Enviando pedido..." : "Confirmar pedido"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* HS-06: Registro e inicio de sesión */}
      {vista === "cuenta" && (
        <div>
          <h2>Mi cuenta</h2>

          {usuario ? (
            <div className="tarjeta tarjeta-ancha">
              <p>Nombre: <strong>{usuario.nombre}</strong></p>
              <p>Correo: <strong>{usuario.correo}</strong></p>
              <p>Tus datos se rellenan solos en el checkout y en la cotización.</p>
              <button onClick={cerrarSesion}>Cerrar sesión</button>
            </div>
          ) : (
            <div>
              <div className="filtros">
                <button
                  className={modoCuenta === "entrar" ? "activo" : ""}
                  onClick={() => {
                    setModoCuenta("entrar");
                    setErrorCuenta("");
                  }}
                >
                  Iniciar sesión
                </button>
                <button
                  className={modoCuenta === "registro" ? "activo" : ""}
                  onClick={() => {
                    setModoCuenta("registro");
                    setErrorCuenta("");
                  }}
                >
                  Crear cuenta
                </button>
              </div>

              <form onSubmit={modoCuenta === "registro" ? registrarCuenta : iniciarSesion}>
                {modoCuenta === "registro" && (
                  <label>
                    Nombre:
                    <input
                      type="text"
                      required
                      value={datosCuenta.nombre}
                      onChange={(e) => setDatosCuenta({ ...datosCuenta, nombre: e.target.value })}
                    />
                  </label>
                )}
                <label>
                  Correo:
                  <input
                    type="email"
                    required
                    value={datosCuenta.correo}
                    onChange={(e) => setDatosCuenta({ ...datosCuenta, correo: e.target.value })}
                  />
                </label>
                <label>
                  Contraseña:
                  <input
                    type="password"
                    required
                    value={datosCuenta.clave}
                    onChange={(e) => setDatosCuenta({ ...datosCuenta, clave: e.target.value })}
                  />
                </label>
                {errorCuenta && <p className="error">{errorCuenta}</p>}
                <button type="submit">{modoCuenta === "registro" ? "Crear cuenta" : "Entrar"}</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* HS-09: Formulario de cotización */}
      {vista === "cotizacion" && (
        <div>
          <h2>Pedidos especiales</h2>
          {enviado ? (
            <p>
              ¡Gracias, {formulario.nombre}! Recibimos tu solicitud de {formulario.cantidad} pieza(s).
              Pronto te contactaremos.
            </p>
          ) : (
            <form onSubmit={enviarFormulario}>
              <label>
                Nombre:
                <input
                  type="text"
                  required
                  value={formulario.nombre}
                  onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                />
              </label>
              <label>
                Correo:
                <input
                  type="email"
                  required
                  value={formulario.correo}
                  onChange={(e) => setFormulario({ ...formulario, correo: e.target.value })}
                />
              </label>
              <label>
                Cantidad:
                <input
                  type="number"
                  min="1"
                  required
                  value={formulario.cantidad}
                  onChange={(e) => setFormulario({ ...formulario, cantidad: e.target.value })}
                />
              </label>
              <label>
                Mensaje:
                <textarea
                  required
                  value={formulario.mensaje}
                  onChange={(e) => setFormulario({ ...formulario, mensaje: e.target.value })}
                />
              </label>
              {errorEnvio && <p className="error">{errorEnvio}</p>}
              <button type="submit" disabled={enviando}>
                {enviando ? "Enviando..." : "Enviar"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

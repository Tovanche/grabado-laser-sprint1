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

// HS-09: dirección del servicio que recibe el formulario y lo manda al correo del negocio.
// Se crea un formulario gratis en https://formspree.io y se guarda su URL en el archivo .env:
// VITE_FORM_URL=https://formspree.io/f/xxxxxxxx
const URL_FORMULARIO = import.meta.env.VITE_FORM_URL || "https://formspree.io/f/xbgdpdwq";

function App() {
  const [vista, setVista] = useState("catalogo");

  // HS-01: categoría seleccionada en el filtro
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [textoGrabado, setTextoGrabado] = useState("");

  // HS-02: estilo de letra elegido
  const [estiloLetra, setEstiloLetra] = useState(estilosLetra[0].nombre);

  const [carrito, setCarrito] = useState([]);

  // HS-09: ahora el formulario también pide la cantidad
  const [formulario, setFormulario] = useState({ nombre: "", correo: "", cantidad: 1, mensaje: "" });
  const [enviado, setEnviado] = useState(false);
  // HS-09: estados del envío real
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");

  // HS-05a: datos de contacto del checkout y pedido confirmado
  const [datosPedido, setDatosPedido] = useState({ nombre: "", correo: "", telefono: "", direccion: "" });
  const [pedido, setPedido] = useState(null);

  // --- Funciones que puede hacer el usuario ---

  function abrirDetalle(producto) {
    setProductoSeleccionado(producto);
    setTextoGrabado("");
    setEstiloLetra(estilosLetra[0].nombre);
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

  // HS-05a: confirma el pedido con los datos de contacto y vacía el carrito
  function confirmarPedido(e) {
    e.preventDefault();
    const numero = "GD-" + String(Date.now()).slice(-6);
    setPedido({ numero, items: carrito, total, datos: datosPedido });
    setCarrito([]);
  }

  const total = carrito.reduce((suma, item) => suma + item.precio, 0);

  // HS-01: productos que se muestran según el filtro
  const productosFiltrados =
    categoriaActiva === "Todas"
      ? productos
      : productos.filter((producto) => producto.categoria === categoriaActiva);

  // --- Lo que se dibuja en pantalla ---
  return (
    <div className="app">
      {/* Barra de navegación simple */}
      <nav className="nav">
        <button onClick={() => setVista("catalogo")}>Catálogo</button>
        <button onClick={() => setVista("carrito")}>Carrito ({carrito.length})</button>
        <button onClick={() => setVista("cotizacion")}>Cotización</button>
      </nav>

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
            <button
              onClick={() => {
                setPedido(null);
                setVista("checkout");
              }}
            >
              Continuar con la compra
            </button>
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
                <button type="submit">Confirmar pedido</button>
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

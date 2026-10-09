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

  function enviarFormulario(e) {
    e.preventDefault();
    setEnviado(true);
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

          {/* Vista previa: muestra el texto con el estilo de letra elegido */}
          <div className="vista-previa">
            <p>Vista previa del grabado:</p>
            <div className="recuadro-grabado" style={{ fontFamily: fuenteDe(estiloLetra) }}>
              {textoGrabado || "Tu texto aquí"}
            </div>
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
              <button type="submit">Enviar</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

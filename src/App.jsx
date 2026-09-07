import { useState } from "react";

// --- HU-01: Lista de productos del catálogo ---
const productos = [
  { id: 1, nombre: "Cartera de cuero", categoria: "Carteras", precio: 590 },
  { id: 2, nombre: "Playera de algodón", categoria: "Ropa", precio: 320 },
  { id: 3, nombre: "Vaso de aluminio", categoria: "Aluminio", precio: 275 },
  { id: 4, nombre: "Vaso de cristal", categoria: "Cristal", precio: 240 },
];

function App() {
  const [vista, setVista] = useState("catalogo");

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [textoGrabado, setTextoGrabado] = useState("");

  const [carrito, setCarrito] = useState([]);

  const [formulario, setFormulario] = useState({ nombre: "", correo: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);

  // --- Funciones que puede hacer el usuario ---

  function abrirDetalle(producto) {
    setProductoSeleccionado(producto);
    setTextoGrabado("");
    setVista("detalle");
  }

  function agregarAlCarrito() {
    const nuevoItem = {
      ...productoSeleccionado,
      texto: textoGrabado || "Sin texto",
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

  // --- Lo que se dibuja en pantalla ---
  return (
    <div className="app">
      {/* Barra de navegación simple */}
      <nav className="nav">
        <button onClick={() => setVista("catalogo")}>Catálogo</button>
        <button onClick={() => setVista("carrito")}>Carrito ({carrito.length})</button>
        <button onClick={() => setVista("cotizacion")}>Cotización</button>
      </nav>

      {/* HU-01: Catálogo de productos */}
      {vista === "catalogo" && (
        <div>
          <h1>Grabado Directo</h1>
          <p>Elige un producto para personalizarlo con grabado láser.</p>
          <div className="lista-productos">
            {productos.map((producto) => (
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

      {/* HU-02 y HU-03: Personalización y vista previa */}
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

          {/* Vista previa: simplemente muestra el texto dentro de un recuadro */}
          <div className="vista-previa">
            <p>Vista previa del grabado:</p>
            <div className="recuadro-grabado">{textoGrabado || "Tu texto aquí"}</div>
          </div>

          <button onClick={agregarAlCarrito}>Agregar al carrito</button>
        </div>
      )}

      {/* HU-04: Carrito de compras */}
      {vista === "carrito" && (
        <div>
          <h2>Tu carrito</h2>
          {carrito.length === 0 && <p>Todavía no agregas productos.</p>}
          {carrito.map((item, index) => (
            <div className="tarjeta" key={index}>
              <p>{item.nombre} — grabado: "{item.texto}"</p>
              <p>${item.precio} MXN</p>
              <button onClick={() => quitarDelCarrito(index)}>Quitar</button>
            </div>
          ))}
          {carrito.length > 0 && <h3>Total: ${total} MXN</h3>}
        </div>
      )}

      {/* HU-09: Formulario de cotización */}
      {vista === "cotizacion" && (
        <div>
          <h2>Pedidos especiales</h2>
          {enviado ? (
            <p>¡Gracias, {formulario.nombre}! Pronto te contactaremos.</p>
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

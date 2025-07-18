// --- Pedidos Internos de Cafetería ---
const listaOrdenes = document.getElementById('listaOrdenes');
const addOrdenBtn = document.getElementById('botonAgregarPedido');
let ordenId = 1;
const pedidos = {}; // Para gestión interna

/** Agrega visualmente un nuevo pedido. */
function agregarPedidoVisual(orden) {
    pedidos[orden.id] = orden;
    listaOrdenes.innerHTML += `
        <li id="pedido-${orden.id}">
            <p><strong>Pedido ID:</strong> ${orden.id}</p>
            <p>Estado: <span id="status-${orden.id}" class="status-en-proceso">${orden.status}</span></p>
        </li>
    `;
    console.log(`[${new Date().toLocaleTimeString()}] Pedido #${orden.id} recibido. Estado: ${orden.status}`);
}

/** Actualiza el estado visual de un pedido. */
function actualizarEstadoVisual(id, nuevoEstado) {
    const statusSpan = document.getElementById(`status-${id}`);
    if (statusSpan) {
        statusSpan.textContent = nuevoEstado;
        statusSpan.className = ''; // Resetear clases
        statusSpan.classList.add(`status-${nuevoEstado.toLowerCase().replace(' ', '-')}`);
        console.log(`[${new Date().toLocaleTimeString()}] Pedido #${id} actualizado a: ${nuevoEstado}`);
    }
}

/** Simula la preparación de un pedido. */
function prepararPedido(id) {
    return new Promise(resolve => {
        setTimeout(() => resolve({ id, status: 'Completado' }), Math.floor(Math.random() * 3000) + 2000);
    });
}

/** Procesa un pedido de forma asíncrona. */
async function processOrden(orden) {
    try {
        const pedidoCompletado = await prepararPedido(orden.id);
        actualizarEstadoVisual(pedidoCompletado.id, pedidoCompletado.status);
        console.log(`[${new Date().toLocaleTimeString()}] ¡Pedido #${pedidoCompletado.id} ha sido Completado!`);
    } catch (error) {
        console.error(`Error al procesar el pedido #${orden.id}:`, error);
        actualizarEstadoVisual(orden.id, 'Error');
    }
}

addOrdenBtn.addEventListener('click', () => {
    const orden = { id: ordenId++, status: 'En Proceso' }; 
    agregarPedidoVisual(orden); 
    processOrden(orden); 
});
console.log('Sistema de Cafetería listo. Haz clic en "Agregar pedidos:".');


// --- Datos del Menú ---
const menu = {
    helados: [
        { id: 'helado-vainilla', nombre: 'Helado de Vainilla', precio: 55.00, img: 'img/vainilla.avif', descripcion: 'Bola de helado de vainilla.' },
        { id: 'helado-chocolate', nombre: 'Helado de Chocolate', precio: 45.00, img: 'img/receta-de-helado-de-chocolate.jpg', descripcion: 'Bola de helado de chocolate.' },
        { id: 'helado-fresa', nombre: 'Helado de Fresa', precio: 35.00, img: 'img/fresa.jpg', descripcion: 'Bola de helado de fresa.' },
    ],
    'bebidas-calientes': [
        { id: 'img/cafe-expreso', nombre: 'Café Expreso', precio: 30.00, img: 'img/cafe.jpg', descripcion: 'Shot de café concentrado.' },
        { id: 'latte', nombre: 'Latte', precio: 45.00, img: 'img/late.jpg', descripcion: 'Café con leche espumosa.' },
        { id: 'chocolate-caliente', nombre: 'Chocolate Caliente', precio: 40.00, img: 'img/chocolate.jpg', descripcion: 'Bebida de chocolate cremoso.' },
    ],
    postres: [
        { id: 'Pastel chocolate', nombre: 'Pastel chocolate', precio: 25.00, img: 'img/cakec.jpg', descripcion: 'Delicioso pastel de chocolate.' },
        { id: 'Pastel tres leches', nombre: 'Pastel tres leches', precio: 30.00, img: 'img/leches.jpg', descripcion: 'Pastel de leches.' },
        { id: 'Pastel de queso', nombre: 'Pastel de queso', precio: 25.00, img: 'img/queso.jpg', descripcion: 'Delicioso pastel de queso.' },
    ]
};

// --- Carrito de Compras y Referencias DOM ---
let carrito = [];
const platillosContainer = document.getElementById('platillos-container');
const categoriaBtns = document.querySelectorAll('.categoria-btn');
const listaCarrito = document.getElementById('lista-carrito');
const carritoTotalSpan = document.getElementById('carrito-total');
const realizarPedidoOnlineBtn = document.getElementById('realizarPedidoOnlineBtn');

/** Carga y muestra los platillos de una categoría. */
function cargarMenu(categoria) {
    platillosContainer.innerHTML = '';
    const platillos = menu[categoria];

    if (!platillos || platillos.length === 0) {
        platillosContainer.innerHTML = '<p class="no-platillos">No hay platillos en esta categoría.</p>';
        return;
    }

    platillos.forEach(platillo => {
        platillosContainer.innerHTML += `
            <div class="platillo-card">
                <img src="${platillo.img}" alt="${platillo.nombre}">
                <h3>${platillo.nombre}</h3>
                <p>${platillo.descripcion}</p>
                <p class="precio">$${platillo.precio.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-id="${platillo.id}" data-categoria="${categoria}">Agregar al Carrito</button>
            </div>
        `;
    });

    // Delegación de eventos para los botones "Agregar al Carrito"
    // Es más eficiente manejar eventos en el contenedor padre
    platillosContainer.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const platilloId = event.target.dataset.id;
            const categoriaDelBoton = event.target.dataset.categoria;
            const platillo = menu[categoriaDelBoton].find(p => p.id === platilloId);
            if (platillo) {
                agregarAlCarrito(platillo);
            }
        });
    });
}

/** Agrega un platillo al carrito. */
function agregarAlCarrito(platillo) {
    const itemExistente = carrito.find(item => item.id === platillo.id);
    itemExistente ? itemExistente.cantidad++ : carrito.push({ ...platillo, cantidad: 1 });
    actualizarCarritoVisual();
}

/** Actualiza la visualización del carrito. */
function actualizarCarritoVisual() {
    listaCarrito.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<li class="carrito-vacio">El carrito está vacío.</li>';
        carritoTotalSpan.textContent = '0.00';
        realizarPedidoOnlineBtn.disabled = true;
        return;
    }

    carrito.forEach(item => {
        listaCarrito.innerHTML += `
            <li>
                <div class="item-info">
                    <span class="item-nombre">${item.nombre}</span>
                    <span class="item-precio-unitario">($${item.precio.toFixed(2)} c/u)</span>
                </div>
                <div class="item-cantidad">
                    <button data-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.cantidad}</span>
                    <button data-id="${item.id}" data-action="increase">+</button>
                </div>
                <span class="item-total">$${(item.precio * item.cantidad).toFixed(2)}</span>
                <button class="item-remover" data-id="${item.id}">X</button>
            </li>
        `;
        total += item.precio * item.cantidad;
    });

    carritoTotalSpan.textContent = total.toFixed(2);
    realizarPedidoOnlineBtn.disabled = false;

    // Delegación de eventos para los botones del carrito
    listaCarrito.addEventListener('click', (event) => {
        const target = event.target;
        const id = target.dataset.id;
        const action = target.dataset.action;

        if (target.classList.contains('item-cantidad-button') || target.classList.contains('item-remover')) {
            const item = carrito.find(i => i.id === id);
            if (item) {
                if (action === 'increase') {
                    item.cantidad++;
                } else if (action === 'decrease') {
                    item.cantidad--;
                    if (item.cantidad <= 0) {
                        carrito = carrito.filter(i => i.id !== id);
                    }
                } else if (target.classList.contains('item-remover')) {
                    carrito = carrito.filter(i => i.id !== id);
                }
                actualizarCarritoVisual();
            }
        }
    });
}

// --- Event Listeners e Inicialización ---

// Event listener para los botones de categoría del menú
categoriaBtns.forEach(button => {
    button.addEventListener('click', (event) => {
        categoriaBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        cargarMenu(event.target.dataset.categoria);
    });
});

// Event listener para el botón "Realizar Pedido Online"
realizarPedidoOnlineBtn.addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega algunos platillos antes de realizar el pedido.');
        return;
    }
    alert(`Pedido Online realizado con éxito! (El pedido fue vaciado del carrito)`);
    carrito = []; 
    actualizarCarritoVisual(); 
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarMenu('helados'); 
    actualizarCarritoVisual(); 
});

console.log('Sistema "Cafeteria" listo para operar. La gestión de pedidos online ha sido eliminada.');


/* menu interactivo, pantalla que muestre el menu , al darle click a uno de los platillos se agregue un carrito de compras  uno*
pantalla donde se muesten todos los pedidos hechos atravez de internet con una simulacion de arreglo ..
para cada pedido agregar un boton para entregar el pedido , fecha, comprador, 
y otra pantalla en donde al hacer click al pedido desparezca */
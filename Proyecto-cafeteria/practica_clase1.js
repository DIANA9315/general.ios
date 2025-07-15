// Contadores y referencias del DOM
const listaOrdenes = document.getElementById('listaOrdenes');
const addOrdenBtn = document.getElementById('botonAgregarPedido');

let ordenId = 1; // Para generar identificadores únicos de pedido

// Objeto para almacenar los pedidos (útil para gestión interna)
const pedidos = {};

/**
 * Agrega visualmente un nuevo pedido a la lista en el HTML.
 * Corresponde a tu `botonAgregarPedido` original.
 * @param {object} orden - Objeto con { id, status }
 */
function agregarPedidoVisual(orden) {
    pedidos[orden.id] = orden; // Almacena el pedido internamente

    const listItem = document.createElement('li');
    listItem.id = `pedido-${orden.id}`; // Asigna un ID al elemento HTML para fácil referencia

    listItem.innerHTML = `
        <p><strong>Pedido ID:</strong> ${orden.id}</p>
        <p>Estado: <span id="status-${orden.id}" class="status-en-proceso">${orden.status}</span></p>
    `;
    listaOrdenes.appendChild(listItem); // Añade el elemento a la lista al final
    console.log(`[${new Date().toLocaleTimeString()}] Pedido #${orden.id} recibido. Estado: ${orden.status}`);
}

/**
 * Actualiza el estado visual de un pedido específico en el DOM.
 * @param {number} id - ID del pedido a actualizar.
 * @param {string} nuevoEstado - El nuevo estado ('En Proceso', 'Completado', etc.).
 */
function actualizarEstadoVisual(id, nuevoEstado) {
    const statusSpan = document.getElementById(`status-${id}`);
    if (statusSpan) {
        statusSpan.textContent = nuevoEstado;
        statusSpan.classList.remove('status-en-proceso', 'status-completado'); // Limpia clases anteriores
        if (nuevoEstado === 'En Proceso') {
            statusSpan.classList.add('status-en-proceso');
        } else if (nuevoEstado === 'Completado') {
            statusSpan.classList.add('status-completado');
        }
        console.log(`[${new Date().toLocaleTimeString()}] Pedido #${id} actualizado a: ${nuevoEstado}`);
    }
}

/**
 * Simula la preparación de un pedido usando setTimeout y Promises.
 * @param {number} id - ID del pedido a preparar.
 * @returns {Promise<object>} Una promesa que se resuelve con el pedido completado.
 */
function prepararPedido(id) {
    const tiempoPreparacion = Math.floor(Math.random() * 3000) + 2000; // Tiempo aleatorio entre 2 y 5 segundos

    return new Promise((resolve) => {
        setTimeout(() => {
            const pedidoCompletado = { id: id, status: 'Completado' };
            resolve(pedidoCompletado);
        }, tiempoPreparacion);
    });
}

/**
 * Procesa un pedido de forma asíncrona, esperando su preparación.
 * Corresponde a tu `processOrden` original.
 * @param {object} orden - El objeto pedido a procesar.
 */
async function processOrden(orden) {
    try {
        // Espera a que el pedido se prepare
        const pedidoCompletado = await prepararPedido(orden.id);
        // Una vez preparado, actualiza su estado visual
        actualizarEstadoVisual(pedidoCompletado.id, pedidoCompletado.status);
        console.log(`[${new Date().toLocaleTimeString()}] ¡Pedido #${pedidoCompletado.id} ha sido Completado!`);
    } catch (error) {
        console.error(`Error al procesar el pedido #${orden.id}:`, error);
        actualizarEstadoVisual(orden.id, 'Error'); // Opcional: mostrar estado de error
    }
}

// Event Listener para el botón "Agregar pedidos"
addOrdenBtn.addEventListener('click', () => {
    // 1. Crea un nuevo pedido con un ID único y estado 'En Proceso'
    const orden = { id: ordenId++, status: 'En Proceso' }; 
    
    // 2. Muestra el pedido en la interfaz inmediatamente
    agregarPedidoVisual(orden); 
    
    // 3. Inicia el procesamiento asíncrono del pedido
    processOrden(orden); 
});

// Mensaje de consola al cargar el script
console.log('Sistema de Cafetería listo. Haz clic en "Agregar pedidos:".');
const BASE_URL = "http://localhost:3000";

// --- Function to get and display all dishes ---
async function obtenerPlatillos() {
    try {
        const respuesta = await fetch(`${BASE_URL}/platillos`);
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const platillos = await respuesta.json();
        console.log("Platillos obtenidos:", platillos);

        const container = document.getElementById("platillos-container");
        container.innerHTML = ''; // Clear previous content

        if (platillos.length > 0) {
            platillos.forEach(platillo => {
                const card = document.createElement('div');
                card.className = 'platillo-card'; // Apply CSS for styling

                card.innerHTML = `
                    <img src="${platillo.imagen}" alt="${platillo.nombre}">
                    <h3>${platillo.nombre}</h3>
                    <p>$${platillo.precio}</p>
                    <button class="add-to-order-btn" data-platillo-id="${platillo.id}">Agregar a la Orden</button>
                `;
                container.appendChild(card);
            });

            // Attach event listeners to all "Agregar a la Orden" buttons
            document.querySelectorAll('.add-to-order-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const platilloId = e.target.dataset.platilloId;
                    console.log(`Platillo con ID ${platilloId} agregado a la orden.`);
                    // --- YOUR ORDER LOGIC GOES HERE ---
                    // For now, just logging. In a real app, you'd add this to an array, update a cart UI, etc.
                    alert(`"${platillos.find(p => p.id == platilloId).nombre}" añadido a la orden!`);
                });
            });

        } else {
            container.innerHTML = '<p>No hay platillos disponibles en el menú.</p>';
        }

    } catch (error) {
        console.error("Error al obtener platillos:", error);
        document.getElementById("platillos-container").innerHTML = '<p>Error al cargar el menú. Inténtalo de nuevo más tarde.</p>';
    }
}

// --- Your existing functions for adding and deleting (for testing) ---
async function agregarPlatillo(){
    let nuevoPlatillo = {
        id: Date.now(),
        nombre: 'Nuevo Platillo de Prueba',
        precio: (Math.random() * 10 + 5).toFixed(2), // Random price
        imagen: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Platillo"
    }

    try {
        let respuesta = await fetch(`${BASE_URL}/platillos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoPlatillo)
        });
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        let json = await respuesta.json();
        console.log("Platillo agregado", json);
        obtenerPlatillos(); // Refresh the list after adding
    } catch (error) {
        console.error("Error al agregar platillo:", error);
    }
}

async function eliminarPlatillo(){
    // IMPORTANT: Hardcoded ID for demonstration. In a real app, get this dynamically.
    const idToDelete = 3;
    try {
        let respuesta = await fetch(`${BASE_URL}/platillos/${idToDelete}`, { method: 'DELETE'} );
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        // No need to parse JSON for DELETE usually, unless your server sends a specific response
        // let json = await respuesta.json(); // May not be needed
        console.log(`Platillo con ID ${idToDelete} eliminado.`);
        obtenerPlatillos(); // Refresh the list after deleting
    } catch (error) {
        console.error("Error al eliminar platillo:", error);
    }
}

// --- Initial call to load dishes when the page loads ---
obtenerPlatillos();

// --- Event Listeners for your test buttons ---
document.getElementById("btnAgregarPlatillo").addEventListener('click', () => {
    console.log("Agregar platillo de prueba...");
    agregarPlatillo();
});

document.getElementById("btnEliminarPlatillo").addEventListener('click', () => {
    console.log("Eliminar platillo de prueba (ID 3)...");
    eliminarPlatillo();
});
const BASE_URL = "https://backend-restaurante-ii.onrender.com"; // Your new URL

// --- Function to get and display all dishes ---
async function obtenerYMostrarPlatillos() { // Renamed for clarity
    try {
        const respuesta = await fetch(`${BASE_URL}/platillos`);
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
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
                    <button class="add-to-order-btn" data-platillo-id="${platillo.id}" data-platillo-nombre="${platillo.nombre}">Agregar a la Orden</button>
                `;
                container.appendChild(card);
            });

            // Attach event listeners to all "Agregar a la Orden" buttons
            document.querySelectorAll('.add-to-order-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const platilloId = e.target.dataset.platilloId;
                    const platilloNombre = e.target.dataset.platilloNombre;
                    console.log(`Platillo con ID ${platilloId} ("${platilloNombre}") agregado a la orden.`);
                    // --- YOUR ORDER LOGIC GOES HERE ---
                    alert(`"${platilloNombre}" añadido a la orden!`);
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
    const nombre = document.getElementById("inputNombrePlatillo").value;
    const precio = document.getElementById("inputPrecioPlatillo").value;
    const imagen = document.getElementById("inputImagenPlatillo").value;

    if (!nombre || !precio || !imagen) {
        alert("Por favor, completa todos los campos para agregar un platillo.");
        return;
    }

    let nuevoPlatillo = {
        id: Date.now(), // Use Date.now() for unique ID, or rely on backend
        nombre: nombre,
        precio: parseFloat(precio), // Convert price to number
        imagen: imagen
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
        // Clear inputs after successful add
        document.getElementById("inputNombrePlatillo").value = '';
        document.getElementById("inputPrecioPlatillo").value = '';
        document.getElementById("inputImagenPlatillo").value = '';
        obtenerYMostrarPlatillos(); // Refresh the list after adding
    } catch (error) {
        console.error("Error al agregar platillo:", error);
        alert("Hubo un error al agregar el platillo. Inténtalo de nuevo.");
    }
}

async function eliminarPlatillo(){
    // IMPORTANT: Hardcoded ID for demonstration.
    // In a real app, you'd get this dynamically, e.g., from a user selection.
    const idToDelete = 3; // Or you could add an input field for ID to delete
    try {
        let respuesta = await fetch(`${BASE_URL}/platillos/${idToDelete}`, { method: 'DELETE'} );
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        console.log(`Platillo con ID ${idToDelete} eliminado.`);
        obtenerYMostrarPlatillos(); // Refresh the list after deleting
    } catch (error) {
        console.error("Error al eliminar platillo:", error);
        alert(`Hubo un error al eliminar el platillo con ID ${idToDelete}.`);
    }
}

// --- Initial call to load dishes when the page loads ---
document.addEventListener('DOMContentLoaded', obtenerYMostrarPlatillos);

// --- Event Listeners for your test buttons ---
document.getElementById("btnAgregarPlatillo").addEventListener('click', () => {
    console.log("Agregar platillo...");
    agregarPlatillo();
});

document.getElementById("btnEliminarPlatillo").addEventListener('click', () => {
    console.log("Eliminar platillo (ID 3)...");
    eliminarPlatillo();
});
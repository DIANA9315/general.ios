// Referencias a los elementos del DOM para el Ejercicio 2
const obtenerLabialesBtn = document.getElementById('obtenerLabialesBtn');
const labialesListElem = document.getElementById('labialesList');
const labialesCountElem = document.getElementById('labialesCount');

// Función para limpiar los resultados anteriores y mostrar un mensaje inicial/de carga
function limpiarResultadosLista() {
    labialesListElem.innerHTML = '<li>Cargando lista de labiales...</li>';
    labialesCountElem.textContent = '';
}

// Función para obtener la Lista de Valores (Labiales)
async function getLipsticksList() {
    const url = 'https://makeup-api.herokuapp.com/api/v1/products.json?product_type=lipstick'; 
    console.log(`Petición (Lista de Labiales): Lanzando a ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al obtener labiales: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Respuesta Lista de Labiales:', data);

        // Limpiar la lista antes de añadir los nuevos elementos
        labialesListElem.innerHTML = ''; 

        if (data && data.length > 0) {
            // Mostrar solo los primeros 10 labiales para no saturar la página
            const labialesAMostrar = data.slice(0, 10);
            labialesAMostrar.forEach(lipstick => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <strong>${lipstick.name}</strong> ($${lipstick.price || 'N/A'} ${lipstick.price_sign || ''}) - Marca: ${lipstick.brand || 'N/A'}
                    ${lipstick.image_link ? `<br><img src="${lipstick.image_link}" alt="${lipstick.name}" style="width: 50px; height: 50px; object-fit: cover;">` : ''}
                `;
                labialesListElem.appendChild(listItem);
            });
            labialesCountElem.textContent = `Total de labiales: ${data.length}`;
            if (data.length > 10) {
                const moreItem = document.createElement('li');
                moreItem.textContent = `...y ${data.length - 10} labiales más.`;
                labialesListElem.appendChild(moreItem);
            }
        } else {
            labialesListElem.innerHTML = '<li>No se encontraron labiales.</li>';
            labialesCountElem.textContent = 'Total de labiales: 0';
        }

    } catch (error) {
        console.error('Error al obtener lista de labiales:', error);
        labialesListElem.innerHTML = `<li>Error: ${error.message}</li>`;
        labialesCountElem.textContent = '';
    }
}

// ASIGNAR EL EVENT LISTENER al botón para el Ejercicio 2
obtenerLabialesBtn.addEventListener('click', getLipsticksList);

// Configurar el estado inicial al cargar la página para el Ejercicio 2
document.addEventListener('DOMContentLoaded', () => {
    limpiarResultadosLista(); 
    labialesListElem.innerHTML = '<li>Haz clic en el botón para cargar la lista de labiales.</li>';
    console.log("Aplicación 2 lista. Esperando clic en el botón.");
});
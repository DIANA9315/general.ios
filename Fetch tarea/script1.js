
// Referencias a los elementos del DOM para el Ejercicio 1
const obtenerProductoSimpleBtn = document.getElementById('obtenerProductoSimpleBtn');
const productoSimpleInfoElem = document.getElementById('productoSimpleInfo');
const productoSimpleImgElem = document.getElementById('productoSimpleImg');

// Función para limpiar los resultados anteriores y mostrar un mensaje inicial/de carga
function limpiarResultadosSimple() {
    productoSimpleInfoElem.textContent = 'Cargando producto único...';
    productoSimpleImgElem.src = '';
    productoSimpleImgElem.style.display = 'none';
}

// Función para obtener el "JSON Sencillo" (Primer producto Maybelline)
async function getSingleProductInfo() {
    const url = 'https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline'; 
    console.log(`Petición (Producto Maybelline): Lanzando a ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al obtener producto Maybelline: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Respuesta Producto Maybelline (Arreglo):', data);

        if (data && data.length > 0) {
            const firstProduct = data[0]; // Tomamos el primer producto del arreglo
            productoSimpleInfoElem.innerHTML = `
                <strong>Nombre:</strong> ${firstProduct.name}<br>
                <strong>Marca:</strong> ${firstProduct.brand}<br>
                <strong>Precio:</strong> $${firstProduct.price} ${firstProduct.price_sign || ''}<br>
                <strong>Tipo:</strong> ${firstProduct.product_type}
            `;
            if (firstProduct.image_link) {
                productoSimpleImgElem.src = firstProduct.image_link;
                productoSimpleImgElem.alt = firstProduct.name;
                productoSimpleImgElem.style.display = 'block';
            } else {
                productoSimpleImgElem.src = '';
                productoSimpleImgElem.style.display = 'none';
            }
        } else {
            productoSimpleInfoElem.textContent = 'No se encontró ningún producto de Maybelline.';
            productoSimpleImgElem.src = '';
            productoSimpleImgElem.style.display = 'none';
        }

    } catch (error) {
        console.error('Error al obtener info del producto simple:', error);
        productoSimpleInfoElem.textContent = `Error: ${error.message}`;
        productoSimpleImgElem.src = '';
        productoSimpleImgElem.style.display = 'none';
    }
}

// ASIGNAR EL EVENT LISTENER al botón para el Ejercicio 1
obtenerProductoSimpleBtn.addEventListener('click', getSingleProductInfo);

// Configurar el estado inicial al cargar la página para el Ejercicio 1
document.addEventListener('DOMContentLoaded', () => {
    limpiarResultadosSimple(); 
    productoSimpleInfoElem.textContent = 'Haz clic en el botón para cargar el primer producto Maybelline.';
    console.log("Aplicación 1 lista. Esperando clic en el botón.");
});


/**dos empoints uno basico json y otro que regrese una lista de valores osea un arreglo, busco la pagina documento, dos peticiones y muestra resultados https://http.cat/*/
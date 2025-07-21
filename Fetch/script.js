// Obtener referencias a los elementos HTML al inicio del script
const fetchBtn = document.getElementById('fetch-btn');
const nombrePersonajeElem = document.getElementById('nombrePersonaje');
const alturaPersonajeElem = document.getElementById('alturaPersonaje');
const fechaNacimientoElem = document.getElementById('fechaNacimiento'); // Usado para el Peso del Pokémon

// **Función auxiliar para limpiar y mostrar mensajes**
// Es importante que esta función esté definida correctamente.
function limpiarYMostrarMensaje(mensaje, esError = false) {
    nombrePersonajeElem.textContent = mensaje;
    alturaPersonajeElem.textContent = '';
    fechaNacimientoElem.textContent = '';
    // Un estilo básico para errores si lo necesitas, sin usar CSS externo
    nombrePersonajeElem.style.color = esError ? 'red' : 'black';
}

// **Función principal para obtener y mostrar los datos del Pokémon**
// Esta función es 'async' porque usa 'await' para el fetch y el .json()
async function obtenerDatosPokemon() { // Renombrada para coincidir con el addEventListener
    // Mostrar un mensaje de "Cargando..." mientras se espera la respuesta
    limpiarYMostrarMensaje('Cargando...');

    console.log(`1. Se lanza la petición.`);

    // La URL para el Pokémon 413
    const urlPokemon = "https://pokeapi.co/api/v2/pokemon/413/";

    try {
        let valorRespuesta = await fetch(urlPokemon); // Espera la respuesta de la petición

        console.log(`2. Se recibió la respuesta del servidor.`);
        console.log(valorRespuesta);

        // Verificar si la respuesta fue exitosa (código 200-299)
        if (!valorRespuesta.ok) {
            // Lanzar un error si la petición no fue exitosa
            throw new Error(`Error HTTP: ${valorRespuesta.status} ${valorRespuesta.statusText}`);
        }

        console.log(`3. Se convierte el body de la respuesta a un objeto literal`);
        let respuestaBodyJson = await valorRespuesta.json(); // Espera la conversión a JSON
        
        console.log(`4. Obtenemos el objeto literal del body de la respuesta.`);
        console.log(respuestaBodyJson);

        // **Actualizar los elementos HTML con los datos correctos del Pokémon**
        // Nombre: Usar directamente el campo 'name', no 'split' para nombres de una palabra
        nombrePersonajeElem.innerText = `Nombre del personaje: ${respuestaBodyJson.name.toUpperCase()}`;

        // Altura: La API devuelve decímetros (dm), dividir por 10 para metros
        alturaPersonajeElem.innerText = `Altura: ${respuestaBodyJson.height / 10}m`;
        
        // "Año de nacimiento": Reutilizamos este elemento para mostrar el Peso.
        // Peso: La API devuelve hectogramos (hg), dividir por 10 para kilogramos.
        fechaNacimientoElem.innerText = `Peso: ${respuestaBodyJson.weight / 10}kg`;

    } catch (error) {
        // Manejo de errores de la petición
        console.error(`Ocurrió un error al realizar la petición:`, error);
        limpiarYMostrarMensaje(`Error: ${error.message}`, true); // Mostrar el error en la página
    }
}

// **Paso clave: Añadir el Event Listener al botón**
// Esto asegura que la función 'obtenerDatosPokemon' solo se ejecute al hacer clic.
fetchBtn.addEventListener('click', obtenerDatosPokemon);

// **Paso opcional pero recomendado: Inicializar la interfaz al cargar la página**
// Esto asegura que la página no esté vacía o con datos viejos/incorrectos al inicio.
document.addEventListener('DOMContentLoaded', () => {
    limpiarYMostrarMensaje('Haz clic en el botón para obtener información del Pokémon.');
    console.log("Aplicación lista. Esperando clic en el botón.");
});

/*
// Ejercicio (comentado porque es solo una descripción, no código funcional)
// 1. Crear una aplicación web que permita hacer una petición a una API que obtenga información de un personaje mediante un boton , utilizando pokemon api.
// 2. Mostrar esa información en la aplicación web (NO EN LA CONSOLA).
// 3. La petición se debe lanzar a través de presionar un botón.
*/
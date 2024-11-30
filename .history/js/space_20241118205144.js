// Elementos del DOM
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const contenedor = document.getElementById('contenedor');

// Función para realizar la búsqueda
btnBuscar.addEventListener('click', async () => {
    const query = inputBuscar.value.trim(); // Obtener y limpiar el valor ingresado

    if (!query) {
        alert('Por favor, ingresa un término de búsqueda.');
        return;
    }

    // Construir la URL de la API
    const apiUrl = `https://images-api.nasa.gov/search?q=${query}`;

    try {
        // Realizar la solicitud
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Validar resultados
        const items = data.collection.items;
        if (!items || items.length === 0) {
            contenedor.innerHTML = `<p class="text-center">No se encontraron resultados para "${query}".</p>`;
            return;
        }

        // Limpiar resultados anteriores
        contenedor.innerHTML = '';

        // Renderizar las tarjetas
        items.forEach((item) => {
            const { title, description, date_created } = item.data[0];
            const imageUrl = item.links?.[0]?.href || 'https://via.placeholder.com/150'; // Imagen o placeholder

            // Crear tarjeta
            const card = document.createElement('div');
            card.className = 'card mb-4';
            card.style.width = '18rem';
            card.innerHTML = `
                <img src="${imageUrl}" class="card-img-top" alt="${title}">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description || 'Descripción no disponible.'}</p>
                    <p class="card-text"><small class="text-muted">Fecha: ${new Date(date_created).toLocaleDateString()}</small></p>
                </div>
            `;

            // Añadir tarjeta al contenedor
            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error('Error al obtener datos:', error);
        contenedor.innerHTML = `<p class="text-center text-danger">Ocurrió un error al obtener los datos.</p>`;
    }
});

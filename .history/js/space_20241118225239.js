// Función para alternar la visibilidad del texto
function toggleDescription(button) {
    const cardBody = button.closest('.card-body');
    const descriptionText = cardBody.querySelector('.card-text');

    // Alternar clases entre "more" y "full" en el texto de la descripción
    if (descriptionText.classList.contains('more')) {
        descriptionText.classList.remove('more');
        descriptionText.classList.add('full');
        button.textContent = 'Ver menos'; // Cambiar el texto del botón
    } else {
        descriptionText.classList.remove('full');
        descriptionText.classList.add('more');
        button.textContent = 'Ver más'; // Cambiar el texto del botón
    }
}

// Asegúrate de que el evento de clic esté correctamente asignado en el HTML generado
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const contenedor = document.getElementById('contenedor');

const searchNASAImages = async () => {
    const query = inputBuscar.value.trim();

    if (!query) {
        alert('Por favor, ingresa un término de búsqueda.');
        return;
    }

    const nasaAPI = `https://images-api.nasa.gov/search?q=${query}`;

    try {
        const response = await fetch(nasaAPI);
        const data = await response.json();

        const items = data.collection.items;
        if (!items || items.length === 0) {
            contenedor.innerHTML = `
            <h3><strong>No hemos encontrado información relacionada a "${query}".</strong></h3>`;
            return;
        }

        contenedor.innerHTML = '';

        const row = document.createElement('div');
        row.className = 'row'; 

        // Formateo de tarjetas
        items.forEach((item) => {
            const { title, description, date_created } = item.data[0];
            const imageUrl = item.links?.[0]?.href || 'https://via.placeholder.com/150';

            // Crear la tarjeta
            const card = document.createElement('div');
            card.className = 'card mb-4';
            card.style.width = '22rem';
            card.innerHTML = `
                <img src="${imageUrl}" class="card-img-top" alt="${title}">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text more">${description || 'Descripción no disponible.'}</p>
                    <!-- Aquí controlamos la visibilidad del botón -->
                    ${description && description.length > 200 ? '<p class="card-text" id="more" onclick="toggleDescription(this)">Ver más</p>' : ''}
                    <p class="card-text"><small class="text-muted">Fecha: ${new Date(date_created).toLocaleDateString()}</small></p>
                </div>
            `;

            // Asegúrate de no mostrar el botón si no hay descripción o si es demasiado corta
            const descriptionText = card.querySelector('.card-text');
            const moreButton = card.querySelector('#more');
            if (!description || description.length <= 200) {
                if (moreButton) {
                    moreButton.style.display = 'none';
                }
                descriptionText.classList.add('full'); // Mostrar toda la descripción si es corta o no hay descripción
            }

            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error('Error al obtener datos:', error);
        contenedor.innerHTML = `<p class="text-center text-danger">Ocurrió un error al obtener los datos.</p>`;
    }
};

btnBuscar.addEventListener('click', searchNASAImages);
inputBuscar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchNASAImages();
    }
});

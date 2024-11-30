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

        // Formateo de tarjetas
        items.forEach((item) => {
            const { title, description, date_created } = item.data[0];
            const imageUrl = item.links?.[0]?.href || 'https://via.placeholder.com/150';

            const card = document.createElement('div');
            card.className = 'card mb-4';
            card.style.width = '22rem';
            card.innerHTML = `
                <img src="${imageUrl}" class="card-img-top" alt="${title}">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description || 'Descripción no disponible.'}</p>
                    <button class="btn btn-link btn-ver-mas">Ver más</button>
                    <p class="card-text"><small class="text-muted">Fecha: ${new Date(date_created).toLocaleDateString()}</small></p>
                </div>
            `;

            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error('Error al obtener datos:', error);
        contenedor.innerHTML = `<p class="text-center text-danger">Ocurrió un error al obtener los datos.</p>`;
    }
};

// Función para alternar la visibilidad del texto
function toggleDescription(button) {
    const cardBody = button.closest('.card-body');
    const descriptionText = cardBody.querySelector('.description-text');

    if (descriptionText.classList.contains('more')) {
        descriptionText.classList.remove('more');
        descriptionText.classList.add('full');
        button.textContent = 'Ver menos';
    } else {
        descriptionText.classList.remove('full');
        descriptionText.classList.add('more');
        button.textContent = 'Ver más';
    }
}

// Buscador
btnBuscar.addEventListener('click', searchNASAImages);
inputBuscar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchNASAImages();
    }
});

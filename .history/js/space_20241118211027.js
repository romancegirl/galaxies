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

        items.forEach((item) => {
            const { title, description, date_created } = item.data[0];
            const imageUrl = item.links?.[0]?.href || 'https://via.placeholder.com/150';

            const card = document.createElement('div');
            card.className = 'card mb-4';
            card.style.width = '18rem';

            // Limitar descripción a 50 palabras
            const shortDescription = description 
                ? description.split(' ').slice(0, 50).join(' ') + '...'
                : 'Descripción no disponible.';

            // Crear tarjeta con botón "Ver más"
            card.innerHTML = `
                <img src="${imageUrl}" class="card-img-top" alt="${title}">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${shortDescription}</p>
                    <button class="btn btn-link btn-sm ver-mas">Ver más</button>
                    <p class="card-text hidden">${description || ''}</p>
                    <p class="card-text"><small class="text-muted">Fecha: ${new Date(date_created).toLocaleDateString()}</small></p>
                </div>
            `;

            contenedor.appendChild(card);
        });

        // Añadir funcionalidad "Ver más"
        addVerMasListeners();
    } catch (error) {
        console.error('Error al obtener datos:', error);
        contenedor.innerHTML = `<p class="text-center text-danger">Ocurrió un error al obtener los datos.</p>`;
    }
};

const addVerMasListeners = () => {
    const buttons = document.querySelectorAll('.ver-mas');
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const cardText = button.previousElementSibling; // La descripción corta
            cardText.classList.toggle('expanded'); // Alternar la clase para mostrar más texto

            if (cardText.classList.contains('expanded')) {
                button.textContent = 'Ver menos';
            } else {
                button.textContent = 'Ver más';
            }
        });
    });
};

// Buscador
btnBuscar.addEventListener('click', searchNASAImages);

inputBuscar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchNASAImages();
    }
});

// Elementos del DOM
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');

// Escuchar el evento "submit" del formulario
searchForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar que la página recargue
    const query = searchInput.value.trim(); // Obtener el valor ingresado

    if (!query) return alert('Please enter a search term.');

    // Construir la URL de la API
    const apiUrl = `https://images-api.nasa.gov/search?q=${query}`;

    try {
        // Realizar la solicitud
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Validar y procesar los datos
        const items = data.collection.items;
        if (!items || items.length === 0) {
            resultsContainer.innerHTML = `<p class="text-center">No results found for "${query}".</p>`;
            return;
        }

        // Limpiar resultados anteriores
        resultsContainer.innerHTML = '';

        // Renderizar los resultados
        items.forEach((item) => {
            const { title, description, date_created } = item.data[0];
            const imageUrl = item.links?.[0]?.href || 'https://via.placeholder.com/150'; // URL de imagen o placeholder

            // Crear tarjeta
            const card = document.createElement('div');
            card.className = 'col-md-4';
            card.innerHTML = `
                <div class="card">
                    <img src="${imageUrl}" class="card-img-top" alt="${title}">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${description || 'No description available.'}</p>
                        <p class="card-text"><small class="text-muted">Date: ${new Date(date_created).toLocaleDateString()}</small></p>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsContainer.innerHTML = `<p class="text-center text-danger">An error occurred while fetching data.</p>`;
    }
});

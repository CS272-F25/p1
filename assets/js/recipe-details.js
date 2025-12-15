document.addEventListener('DOMContentLoaded', async () => {
    const mount = document.getElementById('recipe-details-container');
    if (!mount) {
        console.warn('No mount element found for recipe details.');
        return;
    }

    (async function loadAndRender() {
        try {
            // Parse recipe ID from query param
            const urlParams = new URLSearchParams(window.location.search);
            const recipeId = urlParams.get('id');

            if (!recipeId) {
                throw new Error('No recipe ID provided');
            }

            // Fetch recipe from API
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            const data = await res.json();
            if (!data.meals || data.meals.length === 0) {
                throw new Error('Recipe not found');
            }

            const recipe = convertToRecipe(data.meals[0]);

            mount.innerHTML = '';

            const bar = document.createElement('article');
            bar.className = 'd-flex flex-column flex-md-row mb-4 p-4 bg-white shadow-sm rounded';

            // Media column
            const media = document.createElement('div');
            media.className = 'me-md-4 mb-3 mb-md-0 flex-shrink-0';
            media.style.maxWidth = '400px'; // Limit width like the project media

            const img = recipe.image || 'assets/images/transparent.png';
            const alt = recipe.name || 'Recipe Image';

            media.innerHTML = `<img src="${escapeAttr(img)}" alt="${escapeAttr(alt)}" class="img-fluid rounded shadow-sm">`;

            // Info column
            const info = document.createElement('div');
            info.className = 'flex-grow-1';

            // Ingredients list formatting
            const ingredientsList = recipe.ingredients.map(ing => 
                `<li><strong>${escapeHtml(ing.ingredient)}</strong>: ${escapeHtml(ing.measure)}</li>`
            ).join('');

            // Instructions formatting
            const instructionsHtml = recipe.instructions
                ? recipe.instructions.split(/\r\n|\n/).filter(line => line.trim()).map(line => `<p>${escapeHtml(line)}</p>`).join('')
                : '';

            // Youtube link
            const youtubeLink = recipe.youtube 
                ? `<div class="mt-3"><a href="${escapeAttr(recipe.youtube)}" target="_blank" class="btn btn-danger btn-sm">Watch on YouTube</a></div>` 
                : '';

            info.innerHTML = `
                <div class="d-flex align-items-baseline gap-2 mb-3">
                    <h2 class="mb-0" style="color:#303030">${escapeHtml(recipe.name)}</h2>
                    <span class="text-muted small">${escapeHtml(recipe.category)} • ${escapeHtml(recipe.area)}</span>
                </div>
                
                <div class="mb-4">
                    <h4 class="text-secondary border-bottom pb-2">Ingredients</h4>
                    <ul class="list-unstyled">
                        ${ingredientsList}
                    </ul>
                </div>

                <div class="mb-4">
                    <h4 class="text-secondary border-bottom pb-2">Instructions</h4>
                    <div class="text-dark">
                        ${instructionsHtml}
                    </div>
                </div>

                ${youtubeLink}
            `;

            bar.appendChild(media);
            bar.appendChild(info);
            mount.appendChild(bar);

        } catch (err) {
            console.error('Failed to load recipe', err);
            mount.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Error!</h4>
                    <p>${escapeHtml(err.message || 'Failed to load recipe details.')}</p>
                    <hr>
                    <p class="mb-0"><a href="recipes.html" class="alert-link">Back to Recipes</a></p>
                </div>
            `;
        }
    })();
});

// Escape helpers
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, '&quot;');
}

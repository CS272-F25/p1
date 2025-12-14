function convertToRecipe(mealData) {
    const ingredients = [];

    // we are assuming that there's 20 ingredients max
    for (let i = 1; i <= 20; i++) {
        const ingredient = mealData[`strIngredient${i}`] ?? "Unknown ingredient";
        const measure = mealData[`strMeasure${i}`] ?? "Unknown measure";

        if (ingredient) {
            ingredients.push({
                ingredient: ingredient,
                measure: measure
            });
        }
    }

    return {
        id: mealData.idMeal,
        name: mealData.strMeal,
        category: mealData.strCategory,
        area: mealData.strArea,
        instructions: mealData.strInstructions,
        image: mealData.strMealThumb,
        youtube: mealData.strYoutube,
        ingredients
    };
}

function createRecipeComponent(recipe) {
    const id = String(recipe.id ?? "unknown_id");
    const name = recipe.name ?? "Unknown name";
    const img = recipe.image ?? "";
    const category = recipe.category ?? "Unknown category";
    const area = recipe.area ?? "Unknown area";
    const detailsHref = `recipe-details.html?id=${encodeURIComponent(id)}`;

    const colElement = document.createElement("div");
    colElement.className = "col";

    // Card
    const cardElement = document.createElement("div");
    cardElement.className = "card h-100 shadow-sm";
    colElement.appendChild(cardElement);

    // Card Image
    if (img) {
        const imageElement = document.createElement("img");
        imageElement.className = "card-img-top";
        imageElement.src = img;
        imageElement.alt = name;
        imageElement.loading = "lazy";
        cardElement.appendChild(imageElement);
    }

    // Card Body
    const bodyElement = document.createElement("div");
    bodyElement.className = "card-body d-flex flex-column";
    cardElement.appendChild(bodyElement);

    // Card Title
    const titleElement = document.createElement("h5");
    titleElement.className = "card-title";
    titleElement.textContent = name;
    bodyElement.appendChild(titleElement);

    // Recipe Category + Area
    const metadataElement = document.createElement("p");
    metadataElement.className = "card-text text-muted mb-3";
    metadataElement.textContent = [category, area].filter(Boolean).join(" • ");
    bodyElement.appendChild(metadataElement);

    const actionsElement = document.createElement("div");
    actionsElement.className = "mt-auto d-grid gap-2";
    bodyElement.appendChild(actionsElement);

    // View Details Btn
    const viewDetailsBtnElement = document.createElement("a");
    viewDetailsBtnElement.className = "btn btn-outline-primary";
    viewDetailsBtnElement.href = detailsHref;
    viewDetailsBtnElement.textContent = "View Details";
    actionsElement.appendChild(viewDetailsBtnElement);

    // Fav Btn
    actionsElement.appendChild(createFavoriteButtonComponent(recipe));

    return colElement;
}

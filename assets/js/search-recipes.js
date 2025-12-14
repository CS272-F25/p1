
document.getElementById("recipe-search-form").addEventListener("submit", async (e) => {
    e.preventDefault()
    const searchQuery = document.getElementById("recipe-search-input").value.trim()
    if (!searchQuery) {
        return;
    }
    setSearchQuery(searchQuery)
    handleSearch(searchQuery)
});

document.addEventListener("DOMContentLoaded", () => {
    // auto search if user visits with ?q=something
    const initialQ = getSearchQuery();
    if (initialQ) {
        console.log(initialQ)
        // set input to the query
        document.getElementById("recipe-search-input").value = initialQ.trim()
        // search with the query
        handleSearch(initialQ.trim());
    } else {
        setStatus("Search for a recipe to see results here", "info");
    }
})

function getSearchQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("q");
}

function setSearchQuery(newQuery) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("q", newQuery);
    window.history.replaceState({}, "", newUrl);
}

function handleSearch(searchQuery) {
    console.log("handleSearch", searchQuery)

    // show loading spinner and clear the status area + results list
    setLoading(true)
    clearStatus()
    clearRecipes()

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
        .then(res => res.json())
        .then(data => {
            const results = data.meals
            // if no results, then return
            if (!results) {
                setStatus("No recipes found.", "warning");
                return;
            }
            console.log("results", results)

            // convert to list of recipe objects
            const recipes = []
            for (let result of results) {
                recipes.push(convertToRecipe(result))
            }
            console.log("recipes (converted)", recipes)

            // display the list
            displayRecipes(recipes)
        })
        .catch(error => {
            // log, alert, and show error status
            console.error(error);
            const msg = "Something went wrong while loading recipes. Please try again."
            alert(msg)
            setStatus(msg, "danger")
        })
        .finally(() => {
            // always hide loading spinner once done
            setLoading(false)
        })
}

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

function setLoading(isLoading) {
    const loadingElement = document.getElementById("loading");
    loadingElement.classList.toggle("d-none", !isLoading);
    loadingElement.setAttribute("aria-hidden", String(!isLoading));
}


function setStatus(message, type = "info") {
    clearStatus()

    const statusArea = document.getElementById("status-area");
    const alert = document.createElement("div");
    alert.classList.add("alert", `alert-${type}`);
    alert.setAttribute("role", "alert");
    alert.textContent = message;

    statusArea.appendChild(alert);
}

function clearStatus() {
    const statusArea = document.getElementById("status-area");
    while (statusArea.firstChild) {
        statusArea.removeChild(statusArea.firstChild);
    }
}

function displayRecipes(recipes) {
    // clear results just in case
    clearRecipes()

    // set recipes count
    setRecipesCount(recipes.length)

    // render recipe components
    const resultsElement = document.getElementById("results");
    for (let recipe of recipes) {
        resultsElement.appendChild(createRecipeComponent(recipe))
    }
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
    const favBtnElement = document.createElement("button");
    favBtnElement.className = "btn btn-primary favorite-btn";
    favBtnElement.type = "button";
    favBtnElement.textContent = "Save to Favorites";
    favBtnElement.onclick = () => toggleFavorite(recipe)
    actionsElement.appendChild(favBtnElement);

    return colElement;
}

function clearRecipes() {
    const resultsElement = document.getElementById("results");
    resultsElement.innerHTML = ""
    setRecipesCount(0)
}

function setRecipesCount(count) {
    const element = document.getElementById("results-count");
    element.textContent = `${count} result${count === 1 ? "" : "s"}`;
}

function toggleFavorite(recipe) {
    console.log("toggling favorite for recipe id", recipe.id)
}
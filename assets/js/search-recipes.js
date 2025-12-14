
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


    function clearRecipes() {
        const resultsElement = document.getElementById("results");
        resultsElement.innerHTML = ""
        setRecipesCount(0)
    }

    function setRecipesCount(count) {
        const element = document.getElementById("results-count");
        element.textContent = `${count} result${count === 1 ? "" : "s"}`;
    }

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
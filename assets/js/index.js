document.getElementById("search-form").addEventListener("submit", async (e) => {
    e.preventDefault()
    const searchQuery = document.getElementById("search-input").value.trim()
    if (!searchQuery) {
        return;
    }

    window.location.href = `recipes.html?q=${searchQuery}`
});

document.addEventListener("DOMContentLoaded", () => {
    renderFeaturedRecipes()
})

async function renderFeaturedRecipes() {
    const resultsElement = document.getElementById("featured-recipes");
    const loadingElement = document.getElementById("featured-recipes-loading");
    const errorElement = document.getElementById("featured-recipes-error");

    function clearChildren(el) {
        while (el.firstChild) el.removeChild(el.firstChild);
    }

    function setLoading(isLoading) {
        loadingElement.classList.toggle("d-none", !isLoading);
        loadingElement.setAttribute("aria-hidden", String(!isLoading));
    }

    function clearError() {
        clearChildren(errorElement);
    }

    function showError(message) {
        clearError();
        const type = "danger"
        const alert = document.createElement("div");
        alert.classList.add("alert", `alert-${type}`);
        alert.setAttribute("role", "alert");
        alert.textContent = message;
        errorElement.appendChild(alert);
    }

    // Start state
    clearError();
    clearChildren(resultsElement);
    setLoading(true);

    try {
        const recipes = [];

        for (let i = 0; i < 3; i++) {
            const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
            if (!res.ok) throw new Error(`Request failed: ${res.status}`);

            const data = await res.json();
            const meal = data?.meals?.[0];
            if (meal) recipes.push(convertToRecipe(meal));
        }

        recipes.forEach(recipe => {
            resultsElement.appendChild(createRecipeComponent(recipe))
        })
    } catch (e) {
        console.error(e);
        const msg = "Something went wrong while loading featured recipes. Please try again."
        alert(msg)
        showError(msg)
    } finally {
        setLoading(false);
    }
}
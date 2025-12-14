document.getElementById("search-form").addEventListener("submit", async (e) => {
    e.preventDefault()
    const searchQuery = document.getElementById("search-input").value.trim()
    if (!searchQuery) {
        return;
    }

    window.location.href = `recipes.html?q=${searchQuery}`
});

document.addEventListener("DOMContentLoaded", () => {
    // load featured recipes



})
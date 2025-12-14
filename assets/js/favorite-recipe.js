function isFavorite(recipe) {
    const authUser = getCurrentUser()
    if (!authUser) {
        return false
    }

    return authUser.favoriteRecipes.some(r => r.id === recipe.id)
}

function toggleFavorite(buttonElement, recipe) {
    const authUser = getCurrentUser();
    if (!authUser) {
        alert("Please sign in to save favorites");
        return;
    }

    const users = getUsers();
    const username = authUser.username;
    const user = users[username];

    if (!user.favoriteRecipes) {
        user.favoriteRecipes = [];
    }

    const index = user.favoriteRecipes.findIndex(r => r.id === recipe.id);

    if (index === -1) {
        // add
        user.favoriteRecipes.push({
            id: recipe.id,
            name: recipe.name,
            thumb: recipe.thumb
        });
        buttonElement.textContent = "Remove from Favorites";
        buttonElement.classList.replace("btn-primary", "btn-danger");
    } else {
        // remove
        user.favoriteRecipes.splice(index, 1);
        buttonElement.textContent = "Save to Favorites";
        buttonElement.classList.replace("btn-danger", "btn-primary");
    }

    saveUsers(users); // persist

    console.log(
        index === -1
            ? "added to favorites"
            : "removed from favorites",
        recipe.id
    );
}

function createFavoriteButtonComponent(recipe) {
    const buttonElement = document.createElement("button");
    if (isFavorite(recipe)) {
        buttonElement.className = "btn btn-danger";
        buttonElement.textContent = "Remove from Favorites";
    } else {
        buttonElement.className = "btn btn-primary";
        buttonElement.textContent = "Save to Favorites";
    }

    buttonElement.type = "button";
    buttonElement.onclick = () => {
        toggleFavorite(buttonElement, recipe)
    }

    return buttonElement
}

function getFavoriteRecipes() {
    const authUser = getCurrentUser()
    if (!authUser) {
        return null
    }

    return authUser.favoriteRecipes
}
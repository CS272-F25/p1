document.getElementById("signup-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    // Perform any validation or processing of form data here
    function validateUsername(input) {
        if (!input || input.trim().length < 1) {
            return "Username must be at least 1 character";
        }

        const users = getUsers();

        // ensure username isn't already taken
        if (users[input]) {
            return "Username already exists"
        }

        return null
    }

    function validatePassword(input) {
        if (!input || input.length < 1) {
            return "Password must be at least 1 character";
        }

        return null
    }

    // validate username
    let validationErrMsg = validateUsername(username)
    if (validationErrMsg) {
        alert(validationErrMsg)
        return;
    }

    // validate password
    validationErrMsg = validatePassword(password)
    if (validationErrMsg) {
        alert(validationErrMsg)
        return;
    }

    const data = {
        username,
        password
    }

    signUp(data.username, data.password)
    alert("Successfully signed up!");
    window.location.href = "index.html";
    event.target.reset();
});

function signUp(username, password) {
    // Note: we assume username and password are validated beforehand
    const users = getUsers();
    users[username] = { password, favoriteRecipes: [] };
    saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, username);
}
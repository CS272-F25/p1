document.getElementById("signup-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    const statusArea = document.getElementById("signup-status-area");

    function setStatus(message, type = "info") {
        clearStatus()

        const alert = document.createElement("div");
        alert.classList.add("alert", `alert-${type}`);
        alert.setAttribute("role", "alert");
        alert.textContent = message;
        statusArea.appendChild(alert);
    }

    function clearStatus() {
        while (statusArea.firstChild) {
            statusArea.removeChild(statusArea.firstChild);
        }
    }

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
        if (!input || input.length < 6) {
            return "Password must be at least 6 characters";
        }

        return null
    }

    clearStatus()

    // validate username
    let validationErrMsg = validateUsername(username)
    if (validationErrMsg) {
        alert(validationErrMsg)
        setStatus(validationErrMsg, "danger")
        return;
    }

    // validate password
    validationErrMsg = validatePassword(password)
    if (validationErrMsg) {
        alert(validationErrMsg)
        setStatus(validationErrMsg, "danger")
        return;
    }

    // append new user to users list in local storage
    const users = getUsers();
    users[username] = { password, favoriteRecipes: [] };
    saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, username);

    alert("Successfully signed up!");
    window.location.href = "index.html";
    event.target.reset();
    clearStatus()
});
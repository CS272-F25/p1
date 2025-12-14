document.getElementById("signin-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    const statusArea = document.getElementById("signin-status-area");

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

    function validate() {
        const users = getUsers();

        // ensure user exists
        if (!users[username]) {
            return "User not found"
        }

        // ensure password matches
        if (users[username].password !== password) {
            return "Incorrect password"
        }

        return null
    }

    clearStatus()

    // validate username and password
    let validationErrMsg = validate()
    if (validationErrMsg) {
        alert(validationErrMsg)
        setStatus(validationErrMsg, "danger")
        return;
    }

    // set current user name in local storage
    localStorage.setItem(CURRENT_USER_KEY, username);

    alert("Successfully signed in!");
    window.location.href = "index.html";
    event.target.reset();
    clearStatus()
});
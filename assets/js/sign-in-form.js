document.getElementById("signin-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

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

    // validate username and password
    let validationErrMsg = validate()
    if (validationErrMsg) {
        alert(validationErrMsg)
        return;
    }

    // set current user name in local storage
    localStorage.setItem(CURRENT_USER_KEY, username);

    alert("Successfully signed in!");
    window.location.href = "index.html";
    event.target.reset();
});
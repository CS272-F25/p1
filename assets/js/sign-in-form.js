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

    const data = {
        username,
        password
    }

    signIn(data.username, data.password)
    alert("Successfully signed in!");
    window.location.href = "index.html";
    event.target.reset();
});


function signIn(username, password) {
    localStorage.setItem(CURRENT_USER_KEY, username);
}
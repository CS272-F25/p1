// Run on load
document.addEventListener("DOMContentLoaded", () => {
    updateAuthNav()
    highlightActiveNav()
});

const USERS_KEY = "USERS"
const CURRENT_USER_KEY = "CURRENT_USER"

function highlightActiveNav() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf("/") + 1);

    const links = document.querySelectorAll(".navbar-nav .nav-link");

    links.forEach(link => {
        const href = link.getAttribute("href");

        if (href === page) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });
}


// LOCAL STORAGE
function getUsers() {
    try {
        const strJSON = localStorage.getItem(USERS_KEY);
        if (!strJSON) {
            return {};
        }
        return JSON.parse(strJSON)
    } catch (e) {
        console.error("loadUsers::", e)
        return {};
    }
}

function saveUsers(usersObj) {
    localStorage.setItem(USERS_KEY, JSON.stringify(usersObj));
}

// AUTH
// Returns the currently signed-in user object
// { username, password, favoriteRecipes } OR null if none signed in or user missing
function getCurrentUser() {
    const username = localStorage.getItem(CURRENT_USER_KEY);
    if (!username) return null;

    const users = getUsers();
    const user = users[username];
    if (!user) return null;

    return { username, ...user };
}

function signOut() {
    localStorage.removeItem(CURRENT_USER_KEY);
    alert("Successfully signed out!")
}

function updateAuthNav() {
    const current = getCurrentUser();

    const signInLink = document.getElementById("nav-signin");
    const signUpLink = document.getElementById("nav-signup");
    const signOutBtn = document.getElementById("nav-signout");

    if (!signInLink || !signUpLink || !signOutBtn) return;

    if (current) {
        signInLink.classList.add("d-none");
        signUpLink.classList.add("d-none");
        signOutBtn.parentElement.classList.remove("d-none");

        signOutBtn.addEventListener("click", () => {
            signOut();
            window.location.reload();
        });
    } else {
        signInLink.classList.remove("d-none");
        signUpLink.classList.remove("d-none");
        signOutBtn.parentElement.classList.add("d-none");
    }
}
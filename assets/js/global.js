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

// Run on load
document.addEventListener("DOMContentLoaded", highlightActiveNav);

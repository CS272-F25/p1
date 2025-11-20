function submitForm() {
    const form = document.getElementById("contact-form");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        alert("Please complete all fields before submitting.");
        return;
    }

    alert("Thank you for contacting Global Kitchen! We will get back to you soon.");

    form.reset();
}
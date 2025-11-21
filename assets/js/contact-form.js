document.getElementById("contact-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let message = document.getElementById("message").value;

  // Perform any validation or processing of form data here
  function ValidateEmail(input) {
    var validRegex =/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

  function validatePhone(input) {
    var validRegex =/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (input.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }
  
  function validateName(input) {
    var validRegex =/^[A-Za-z .'-]+$/;
    if (input.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

  // Validate Name
  if (!validateName(name)) {
    alert("Name is required");
    return;
    // Validate Email
  } else if (!ValidateEmail(email)) {
    alert("Invalid Email");
    return;
    // Validate no 10 min mail addresses
  } else if (['gmail', 'hotmail', 'yahoo', 'outlook'].includes(email.split('@')[1].split('.')[0])) {
    alert("Email not accepted");
    return;
    // Validate Message
  } else if (!message) {
    alert("Message is required");
    return;
  } 
  
  if (phone) {
    if (!validatePhone(phone)) {
      alert("Invalid Phone Number");
      return;
    }
  } else { // If no phone number, set to "none provided"
    phone = "none provided";
  }

  const data = {
    name,
    email,
    phone,
    message,
  };

  // Simple non functional contact form, just shows an alert
  alert("Contact form submitted successfully!");
  event.target.reset();
});
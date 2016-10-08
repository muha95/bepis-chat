var emailInput = document.getElementById("email");
var usernameInput = document.getElementById("username");
var passwordInput = document.getElementById("password");

if(emailInput) {
    emailInput.addEventListener("keyup", function(event) {
        if(emailInput.validity.typeMismatch) {
            emailInput.setCustomValidity("Please enter a valid email.");
        } else {
            emailInput.setCustomValidity("");
        }
    });
}

if(usernameInput) {
    usernameInput.addEventListener("keyup", function(event) {
        var pattern = /^[a-zA-Z0-9]{4,}$/;
        if(!pattern.test(usernameInput.value)) {
            usernameInput.setCustomValidity("Please enter a valid username");
        } else {
            usernameInput.setCustomValidity("");
        }
    });
}

if(passwordInput) {
    passwordInput.addEventListener("keyup", function(event) {
        var pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])[A-Za-z0-9]{8,}$/;
        if(!pattern.test(passwordInput.value)) {
            passwordInput.setCustomValidity("Please enter a valid password");
        } else {
            passwordInput.setCustomValidity("");
        }
    });
}
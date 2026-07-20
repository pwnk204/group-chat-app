const API_URL = 'api/v1/user/register';

async function handleSignup(e) {

    e.preventDefault();

    try {
        const password = document.getElementById("password").value;
        const payload = {
            name: e.target.userName.value,
            email: e.target.userEmail.value,
            phone: e.target.userPhone.value,
            password
        }

        const confirmPassword = document.getElementById("confirm-password").value;

        console.log({confirmPassword, password});

        if(password !== confirmPassword){
            alert("passwords  do not match");
            return;
        }

        const response = await axios.post(API_URL, payload);

        const email = response.data.data.email;

        console.log("User registered successfully", {email});

        window.location.href = "login.html";
    } catch (error) {
       const message = error.response.data.message;
       alert(message);     
    }
    
} 

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  if (form) {
    form.addEventListener("submit", handleSignup);
  }
});

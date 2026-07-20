const API_URL = "/api/v1/user/login";

async function handleLogin(e) {

    e.preventDefault();

    try {
        const payload = {
            email: e.target.userEmail.value,
            password: e.target.password.value
        }


        const response = await axios.post(API_URL, payload);

        const email = response.data.data.email;

        console.log("User loggedIn successfully", {email});
        window.location.href = "/";
    } catch (error) {

       console.log({err : error});
       alert("An unexpected error occurred during login.");
        
    }
    
} 

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  console.log(form);
  if (form) {
    form.addEventListener("submit", handleLogin);
    console.log("inside if condition")
  }
});

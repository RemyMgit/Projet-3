// Récupérer form dans une const
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêche la page de recharger sur le onClick

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  // Envoi des données sur l'API
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.token) {
        // stocker le authToken
        localStorage.setItem("token", response.token);
        window.location.href = "index.html";
      } else {
        alert("Identifiants non valides");
      }
    });
});

const login = document.getElementById("loginStatus");

if (localStorage.getItem("token")) {
  login.innerHTML =
    '<a href="login.html" class="link" id="logout"><li>logout</li></a>';
}

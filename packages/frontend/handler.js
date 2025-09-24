import { gql } from "https://esm.sh/graphql-request@6";

const loginPage = document.getElementById("login-page");
const welcomePage = document.getElementById("welcome-page");
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const loginError = document.getElementById("login-error");
const logoutButton = document.getElementById("logout-button");
const userNameSpan = document.getElementById("user-name");
const userDetailsDiv = document.getElementById("user-details");

function showLoginPage() {
  loginPage.classList.remove("hidden");
  welcomePage.classList.add("hidden");
}

function showWelcomePage(user) {
  userNameSpan.textContent = user.name;
  userDetailsDiv.innerHTML = `
        <p><strong>ID:</strong> ${user._id}</p>
        <p><strong>Nome:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Empresa:</strong> ${user.company}</p>
    `;

  loginPage.classList.add("hidden");
  welcomePage.classList.remove("hidden");
}

async function handleLogin(event) {
  event.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  loginButton.disabled = true;
  loginButton.textContent = "Entrando...";
  loginError.textContent = "";

  const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
      loginMutation(email: $email, password: $password) {
        token
        user {
          _id
          name
          email
          company
          updatedAt
        }
      }
    }
  `;

  try {
    // const data = await client.request(LOGIN_MUTATION, { email, password });
    const res = await fetch("http://localhost:3000/local/desafio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: LOGIN_MUTATION,
        variables: { email, password },
      }),
    });

    const data = await res.json();

    const { token, user } = data.data.loginMutation;

    // Salva o token e os dados do usuário no localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Mostra a página de boas-vindas
    showWelcomePage(user);
  } catch (error) {
    console.log("🚀 ~ handleLogin ~ error:", error);
    // Mostra a mensagem de erro da API
    loginError.textContent =
      error.response?.errors[0]?.message || "Ocorreu um erro. Tente novamente.";
  } finally {
    // Reabilita o botão
    loginButton.disabled = false;
    loginButton.textContent = "Entrar";
  }
}

/**
 * Lida com o logout do usuário
 */
function handleLogout() {
  // Limpa os dados do localStorage
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");

  // Mostra a página de login
  showLoginPage();
}

/**
 * Função principal que roda quando a página carrega
 */
function main() {
  // Adiciona os event listeners
  loginForm.addEventListener("submit", handleLogin);
  logoutButton.addEventListener("click", handleLogout);

  // Verifica se o usuário já está logado
  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token && user) {
    // Se tiver token e dados do usuário, vai para a página de boas-vindas
    showWelcomePage(user);
  } else {
    // Senão, mostra a página de login
    showLoginPage();
  }
}

// --- Inicia a aplicação ---
main();

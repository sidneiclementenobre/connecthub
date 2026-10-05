const API_URL = "http://localhost:3000/api";
let token = localStorage.getItem("connecthub_token") || "";

// Elementos de Feedback
const errorBox = document.getElementById("errorBox");
const successBox = document.getElementById("successBox");

function showFeedback(message, isError = true) {
  if (isError) {
    errorBox.textContent = message;
    errorBox.style.display = "block";
    setTimeout(() => (errorBox.style.display = "none"), 4000);
  } else {
    successBox.textContent = message;
    successBox.style.display = "block";
    setTimeout(() => (successBox.style.display = "none"), 4000);
  }
}

function switchScreen(screenId) {
  document.getElementById("authLoginScreen").classList.add("hidden");
  document.getElementById("authRegisterScreen").classList.add("hidden");
  document.getElementById("dashboardScreen").classList.add("hidden");
  document.getElementById(screenId).classList.remove("hidden");
}

// 1. Cadastrar Usuário
async function handleRegister() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Erro ao cadastrar.");

    showFeedback("Conta criada com sucesso! Faça seu login.", false);
    switchScreen("authLoginScreen");
  } catch (err) {
    showFeedback(err.message);
  }
}

// 2. Autenticar Usuário (Login)
async function handleLogin() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok)
      throw new Error(data.error || "Senha ou e-mail incorretos.");

    token = data.token;
    localStorage.setItem("connecthub_token", token);
    document.getElementById(
      "welcomeUser"
    ).textContent = `Olá, ${data.user.name}`;

    showFeedback("Login realizado com sucesso!", false);
    switchScreen("dashboardScreen");
    loadItems();
  } catch (err) {
    showFeedback(err.message);
  }
}

// 3. Criar Item (POST Protegido)
async function handleCreateItem() {
  const title = document.getElementById("itemTitle").value;
  const description = document.getElementById("itemDescription").value;
  const value = parseFloat(document.getElementById("itemValue").value) || 0;

  try {
    const response = await fetch(`${API_URL}/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, value }),
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Erro ao salvar dados.");

    showFeedback("Registro armazenado em nuvem!", false);
    loadItems();

    // Limpa campos
    document.getElementById("itemTitle").value = "";
    document.getElementById("itemDescription").value = "";
    document.getElementById("itemValue").value = "";
  } catch (err) {
    showFeedback(err.message);
  }
}

// 4. Listar Itens do Usuário Logado (GET Protegido)
async function loadItems() {
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "<p>Sincronizando dados...</p>";

  try {
    const response = await fetch(`${API_URL}/data`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Erro ao carregar dados.");

    container.innerHTML = "";
    if (data.length === 0) {
      container.innerHTML =
        '<p style="color: #888;">Nenhum registro encontrado localmente ou na nuvem.</p>';
      return;
    }

    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "item-card";
      card.innerHTML = `
                <h4>${item.title}</h4>
                <p>${item.description || "Sem descrição."}</p>
                <div class="value">R$ ${item.value.toFixed(2)}</div>
                <div class="item-actions">
                    <button class="btn-delete" onclick="handleDeleteItem('${
                      item._id
                    }')">Excluir</button>
                </div>
            `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = `<p style="color: red;">${err.message}</p>`;
  }
}

// 5. Excluir Item (DELETE Protegido)
async function handleDeleteItem(id) {
  if (
    !confirm("Deseja realmente apagar este registro permanentemente da nuvem?")
  )
    return;

  try {
    const response = await fetch(`${API_URL}/data/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Não autorizado.");

    showFeedback("Registro excluído com sucesso!", false);
    loadItems();
  } catch (err) {
    showFeedback(err.message);
  }
}

// Logout
function handleLogout() {
  localStorage.removeItem("connecthub_token");
  token = "";
  switchScreen("authLoginScreen");
}

// Verificação de Sessão Inicial
if (token) {
  switchScreen("dashboardScreen");
  loadItems();
}

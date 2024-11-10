document.addEventListener("DOMContentLoaded", () => {
  let db;
  const request = indexedDB.open("usuariosDB", 1);

  request.onerror = function (event) {
    console.error("Erro ao abrir o IndexedDB", event);
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Banco de dados aberto com sucesso");
    fetchUsers();
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("usuarios", {
      keyPath: "id",
      autoIncrement: true,
    });
    objectStore.createIndex("nome", "nome", { unique: false });
    objectStore.createIndex("email", "email", { unique: true });
  };

  document
    .getElementById("userForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const nome = document.getElementById("userName").value;
      const email = document.getElementById("userEmail").value;

      const transaction = db.transaction(["usuarios"], "readwrite");
      const objectStore = transaction.objectStore("usuarios");
      const request = objectStore.add({ nome: nome, email: email });

      request.onsuccess = function (event) {
        console.log("Usuário cadastrado com sucesso");
        sessionStorage.setItem("username", nome); // Salvando o nome do usuário
        displayWelcomeMessage(nome);
        fetchUsers();
      };

      request.onerror = function (event) {
        console.error("Erro ao cadastrar o usuário", event);
      };

      document.getElementById("userForm").reset();
    });

  function fetchUsers() {
    const transaction = db.transaction(["usuarios"], "readonly");
    const objectStore = transaction.objectStore("usuarios");
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
      const users = event.target.result;
      const userTableBody = document.querySelector("#userTable tbody");
      userTableBody.innerHTML = "";

      users.forEach((user) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.nome}</td>
                    <td>${user.email}</td>
                `;
        userTableBody.appendChild(row);
      });
    };
  }

  function displayWelcomeMessage(username) {
    const welcomeMessage = document.getElementById("welcomeMessage");
    welcomeMessage.textContent = `Olá, ${username}!`;
  }

  // Exibe a mensagem de boas-vindas se o nome do usuário estiver no sessionStorage
  const storedUsername = sessionStorage.getItem("username");
  if (storedUsername) {
    displayWelcomeMessage(storedUsername);
  }
});

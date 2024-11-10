document.addEventListener("DOMContentLoaded", () => {
  let db;
  const request = indexedDB.open("estoqueDB", 1);

  request.onerror = function (event) {
    console.error("Erro ao abrir o IndexedDB", event);
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Banco de dados aberto com sucesso");
    fetchProducts();
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("produtos", {
      keyPath: "id",
      autoIncrement: true,
    });
    objectStore.createIndex("nome", "nome", { unique: true });
    objectStore.createIndex("quantidade", "quantidade", { unique: false });
    objectStore.createIndex("local", "local", { unique: false });
  };

  document
    .getElementById("productForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const nome = document.getElementById("productName").value;
      const quantidade = document.getElementById("productQuantity").value;
      const local = document.getElementById("productLocation").value;
      const id = document.getElementById("productId").value;

      if (id === "") {
        const transaction = db.transaction(["produtos"], "readwrite");
        const objectStore = transaction.objectStore("produtos");
        const request = objectStore.add({
          nome: nome,
          quantidade: quantidade,
          local: local,
        });

        request.onsuccess = function (event) {
          console.log("Produto cadastrado com sucesso");
          fetchProducts();
        };

        request.onerror = function (event) {
          console.error("Erro ao cadastrar o produto", event);
        };
      } else {
        const transaction = db.transaction(["produtos"], "readwrite");
        const objectStore = transaction.objectStore("produtos");
        const request = objectStore.put({
          id: parseInt(id),
          nome: nome,
          quantidade: quantidade,
          local: local,
        });

        request.onsuccess = function (event) {
          console.log("Produto atualizado com sucesso");
          fetchProducts();
        };

        request.onerror = function (event) {
          console.error("Erro ao atualizar o produto", event);
        };

        document.getElementById("productId").value = "";
        document.getElementById("updateButton").style.display = "none";
        document.querySelector('button[type="submit"]').style.display =
          "inline-block";
      }

      document.getElementById("productForm").reset();
    });

  function fetchProducts() {
    const transaction = db.transaction(["produtos"], "readonly");
    const objectStore = transaction.objectStore("produtos");
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
      const products = event.target.result;
      const productTableBody = document.querySelector("#productTable tbody");
      productTableBody.innerHTML = "";

      products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                  <td>${product.id}</td>
                  <td>${product.nome}</td>
                  <td>${product.quantidade}</td>
                  <td>${product.local}</td>
                  <td>
                      <button onclick="editProduct(${product.id}, '${product.nome}', ${product.quantidade}, '${product.local}')">Editar</button>
                      <button onclick="deleteProduct(${product.id})">Excluir</button>
                  </td>
              `;
        productTableBody.appendChild(row);
      });
    };
  }

  window.editProduct = function (id, nome, quantidade, local) {
    document.getElementById("productName").value = nome;
    document.getElementById("productQuantity").value = quantidade;
    document.getElementById("productLocation").value = local;
    document.getElementById("productId").value = id;
    document.querySelector('button[type="submit"]').style.display = "none";
    document.getElementById("updateButton").style.display = "inline-block";
  };

  window.deleteProduct = function (id) {
    const transaction = db.transaction(["produtos"], "readwrite");
    const objectStore = transaction.objectStore("produtos");
    const request = objectStore.delete(id);

    request.onsuccess = function (event) {
      console.log("Produto excluído com sucesso");
      fetchProducts();
    };

    request.onerror = function (event) {
      console.error("Erro ao excluir o produto", event);
    };
  };

  document
    .getElementById("updateButton")
    .addEventListener("click", function (event) {
      document.getElementById("productForm").dispatchEvent(new Event("submit"));
    });
});

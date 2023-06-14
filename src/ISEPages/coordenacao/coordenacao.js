function renderizarDados(data) {
    var container = document.querySelector(".card-deck");

    container.innerHTML = "";

    data.forEach(function (item) {
        var card = document.createElement("div");
        card.classList.add("col-md-6", "mb-4");
        card.innerHTML = `
      <div class="card">
        <img src="${item.imagem}" class="rounded-circle mx-auto my-3" style="width: 150px; height: 150px" alt="Imagem do Aluno" />
        <div class="card-body text-center">
          <h5 class="card-title">${item.nome}</h5>
          <div class="card-text">${item.descricao}</div>
          <div class="card-edit" style="display: none;">
            <input type="text" class="form-control mb-2" value="${item.nome}">
            <textarea class="form-control">${item.descricao}</textarea>
          </div>
          <div class="card-icons pt-3"> 
            <button class="bg-white border-0" onclick="exportarAluno('${item.nome}', '${item.descricao}')">
              <i class="fa fa-folder mx-3"></i> Exportar
            </button>
            <button class="bg-white border-0" onclick="toggleEdicao(this)">
              <i class="fa fa-pencil mx-3"></i> Editar
            </button>
            <button class="bg-white border-0" style="display: none;" onclick="salvarEdicao(this)">
              <i class="fa fa-check mx-3"></i> Salvar
            </button>
          </div>
        </div>
      </div>
    `;
        container.appendChild(card);
    });
}

function toggleEdicao(button) {
    var card = button.closest(".card");
    var cardTitle = card.querySelector(".card-title");
    var cardText = card.querySelector(".card-text");
    var cardEdit = card.querySelector(".card-edit");
    var editButton = card.querySelector(".fa-pencil");
    var saveButton = card.querySelector(".fa-check");

    if (cardTitle.style.display === "none") {
        cardTitle.style.display = "block";
        cardText.style.display = "block";
        cardEdit.style.display = "none";
        editButton.parentNode.style.display = "inline";
        saveButton.parentNode.style.display = "none";
    } else {
        cardTitle.style.display = "none";
        cardText.style.display = "none";
        cardEdit.style.display = "block";
        editButton.parentNode.style.display = "none";
        saveButton.parentNode.style.display = "inline";
    }
}

function salvarEdicao(button) {
    var card = button.closest(".card");
    var cardTitle = card.querySelector(".card-title");
    var cardText = card.querySelector(".card-text");
    var cardEdit = card.querySelector(".card-edit");

    var nomeInput = cardEdit.querySelector("input[type='text']");
    var descricaoInput = cardEdit.querySelector("textarea");

    cardTitle.textContent = nomeInput.value;
    cardText.innerHTML = descricaoInput.value;

    toggleEdicao(button);
}

function exportarAluno(nome, descricao) {
    var element = document.createElement("div");
    element.classList.add("pdf-content");
    element.innerHTML = `
    <h2 class="text-center">${nome}</h2>
    <p class="text-center">${descricao}</p>
  `;

    html2pdf().from(element).save("aluno.pdf");
}

fetch("../alunos.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        renderizarDados(data);
    });

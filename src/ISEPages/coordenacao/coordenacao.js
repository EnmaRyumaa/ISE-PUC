function validate() {
    var url = window.location.href;
    var paramIndex = url.indexOf("id=");

    if (paramIndex !== -1) {
        var number = url.substring(paramIndex + 3);
        window.location.href = `../perfil/telaPerfil.html?id=${number}`;
    } else {
        console.log("O parâmetro 'id' não foi encontrado na URL");
    }
}

var data = [];

function renderizarDados(data) {
    var container = document.querySelector(".card-deck");

    container.innerHTML = "";

    data.forEach(function (item) {
        var card = document.createElement("div");
        card.classList.add("col-md-6", "mb-4");
        card.innerHTML = `
        <div class="card">
        <div class="text-end">
            <button class="btn text-danger float-right" onclick="excluirAlunoModal(${item.id})">
                <i class="fa fa-trash"></i>
            </button>
        </div>

        <img src="${item.imagem}" class="rounded-circle mx-auto my-3" style="width: 150px; height: 150px" alt="Imagem do Aluno" />
        <div class="card-body text-center">
            <h6 class="card-title"> ${item.nome}</h6>
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
                <button class="bg-white border-0" style="display: none;" onclick="salvarEdicao(this, ${item.id}, '${item.imagem}')">
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

function salvarEdicao(button, id, imagem) {
    var card = button.closest(".card");
    var cardTitle = card.querySelector(".card-title");
    var cardText = card.querySelector(".card-text");
    var cardEdit = card.querySelector(".card-edit");

    var nomeInput = cardEdit.querySelector("input[type='text']");
    var descricaoInput = cardEdit.querySelector("textarea");

    cardTitle.textContent = nomeInput.value;
    cardText.innerHTML = descricaoInput.value;

    toggleEdicao(button);

    var payload = {
        id: id,
        imagem: imagem,
        descricao: descricaoInput.value,
        nome: nomeInput.value,
    };

    fetch(`https://json-server-production-f6c6.up.railway.app/alunos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    }).then(function (data) {
        atualizarListagem();
    });
}

function atualizarListagem() {
    fetch("https://json-server-production-f6c6.up.railway.app/alunos")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            renderizarDados(data);
        });
}
function criarAluno() {
    var nome = document.getElementById("nomeInput").value;
    var descricao = document.getElementById("descricaoInput").value;
    var imagem =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmtykuk3N_onxTc76ii1tYkTzmvdn7VEFhTvA5Cfk&s";

    var ultimoId = data[data.length - 1]?.id;
    var novoId = ultimoId + 1;

    var novoAluno = {
        id: novoId,
        imagem: imagem,
        descricao: descricao,
        nome: nome,
    };

    fetch("https://json-server-production-f6c6.up.railway.app/alunos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(novoAluno),
    }).then(function (response) {
        if (response.ok) {
            console.error(response, "response");
            atualizarListagem();
            $("#criarModal").modal("hide");

            document.getElementById("nomeInput").value = "";
            document.getElementById("descricaoInput").value = "";
        }
    });
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

function excluirAlunoModal(id) {
    var modal = document.getElementById("confirmacaoModal");
    var confirmarBotao = modal.querySelector("#confirmarExclusao");
    confirmarBotao.setAttribute("data-id", id);

    $(modal).modal("show");
}

function excluirAluno(id) {
    fetch(`https://json-server-production-f6c6.up.railway.app/alunos/${id}`, {
        method: "DELETE",
    }).then(function (response) {
        if (response.ok) {
            atualizarListagem();
            $("#confirmacaoModal").modal("hide");
        }
    });
}

fetch("https://json-server-production-f6c6.up.railway.app/alunos")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        renderizarDados(data);
    });

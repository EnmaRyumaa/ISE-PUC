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

function exportarAluno(nome, idade, turma, instituicao, descricao) {
    const caracteristicasFormatadas = descricao.replace(/•/g, "<br>•");

    var element = document.createElement("div");
    element.classList.add("pdf-content");
    element.innerHTML = `
  <h2 class="text-center">${nome}</h2>
  <p class="text-center">Idade: ${idade}</p>
  <p class="text-center">Turma: ${turma}</p>
  <p class="text-center">Instituição: ${instituicao}</p>
  <p class="text-center">${caracteristicasFormatadas}</p>
`;

    html2pdf().from(element).save("aluno.pdf");
}

function editarDescricaoAluno(id) {
    const alunoCard = $(`#aluno-${id}`);
    const descricao = alunoCard.find(".descricao");

    const descricaoText = descricao.text();
    const descricaoInput = $("<textarea>")
        .addClass("form-control")
        .val(descricaoText)
        .attr("name", "descricao");

    descricao.replaceWith(descricaoInput);

    const botoes = alunoCard.find(".botoes");
    botoes.find(".editar-btn").hide();
    botoes.find(".salvar-btn").show();
}

function salvarEdicaoAluno(id) {
    const alunoCard = $(`#aluno-${id}`);
    const descricaoInput = alunoCard.find("textarea[name=descricao]");

    const descricaoText = descricaoInput.val();

    const caracteristicasIndex = descricaoText.indexOf(
        "<strong>Características:</strong>"
    );
    const tituloCaracteristicas = descricaoText.slice(0, caracteristicasIndex);
    const textoCaracteristicas = descricaoText.slice(caracteristicasIndex);

    descricaoInput.replaceWith(
        $("<p>")
            .addClass("descricao")
            .html(`${tituloCaracteristicas}<br>${textoCaracteristicas}`)
    );

    const botoes = alunoCard.find(".botoes");
    botoes.find(".salvar-btn").hide();
    botoes.find(".editar-btn").show();

    // Coletar os dados do aluno
    const nome = alunoCard.find(".nome").text();
    const idade = alunoCard.find(".idade").text().split(": ")[1];
    const turma = alunoCard.find(".turma").text().split(": ")[1];
    const instituicao = alunoCard.find(".instituicao").text().split(": ")[1];
    const imagem = alunoCard.find("img").attr("src");

    // Enviar dados para a rota de atualização (método PUT)
    const data = {
        nome: nome,
        idade: idade,
        turma: turma,
        instituicao: instituicao,
        descricao: descricaoText,
        imagem: imagem,
    };

    fetch(`https://json-server-production-f6c6.up.railway.app/alunos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ocorreu um erro ao atualizar o aluno.");
            }
            console.log("Aluno atualizado com sucesso!");
        })
        .catch((error) => {
            console.log("Ocorreu um erro ao atualizar o aluno:", error);
        });
}

function carregarAlunos() {
    fetch("https://json-server-production-f6c6.up.railway.app/alunos")
        .then((response) => response.json())
        .then((data) => {
            const container = $(".card-inner");

            if (data.length > 0) {
                const aluno = data[0];

                const alunoCard = $("<div>")
                    .addClass("card bg-light")
                    .attr("id", `aluno-${aluno.id}`);
                const alunoCardBody = $("<div>").addClass("card-body");
                const row = $("<div>").addClass("row");
                const colImg = $("<div>").addClass("col-md-3");
                const img = $("<img>")
                    .attr("src", aluno.imagem)
                    .addClass("img img-rounded img-fluid");
                const colInfo = $("<div>").addClass("col-md-9");
                const infoContainer = $("<div>").addClass("info-container");
                const descricao = $("<p>")
                    .addClass("text-secondary text-center descricao")
                    .html(
                        `<strong>Características:</strong><br>${aluno.descricao.replace(
                            /•/g,
                            "<br>•"
                        )}`
                    );
                const botoes = $("<div>").addClass(
                    "d-flex justify-content-end mt-auto botoes"
                );
                const editarLink = $("<a>")
                    .addClass("btn text-white btn-primary ml-2 editar-btn")
                    .on("click", () => {
                        editarDescricaoAluno(aluno.id);
                    });
                const editarIcone = $("<i>").addClass("fa fa-pencil");
                const salvarLink = $("<a>")
                    .addClass("btn text-white btn-success ml-2 salvar-btn")
                    .hide()
                    .on("click", () => {
                        salvarEdicaoAluno(aluno.id);
                    });
                const salvarIcone = $("<i>").addClass("fa fa-check");
                const downloadLink = $("<a>")
                    .addClass("btn text-white btn-primary")
                    .on("click", () => {
                        exportarAluno(
                            aluno.nome,
                            aluno.idade,
                            aluno.turma,
                            aluno.instituicao,
                            aluno.descricao
                        );
                    });
                const downloadIcone = $("<i>").addClass("fa fa-download");

                editarLink.append(editarIcone);
                salvarLink.append(salvarIcone);
                downloadLink.append(downloadIcone);

                botoes.append(editarLink);
                botoes.append(salvarLink);
                botoes.append(downloadLink);

                colImg.append(img);

                infoContainer.append(
                    $("<p>")
                        .addClass("text-secondary text-center nome")
                        .text(aluno.nome)
                );
                infoContainer.append(
                    $("<p>")
                        .addClass("text-secondary text-center idade")
                        .text(`Idade: ${aluno.idade}`)
                );
                infoContainer.append(
                    $("<p>")
                        .addClass("text-secondary text-center turma")
                        .text(`Turma: ${aluno.turma}`)
                );
                infoContainer.append(
                    $("<p>")
                        .addClass("text-secondary text-center instituicao")
                        .text(`Instituição: ${aluno.instituicao}`)
                );

                colInfo.append(infoContainer);
                colInfo.append(descricao);
                colInfo.append(botoes);

                row.append(colImg);
                row.append(colInfo);

                alunoCardBody.append(row);
                alunoCard.append(alunoCardBody);

                container.append(alunoCard);
            }
        })
        .catch((error) => {
            console.log("Ocorreu um erro:", error);
        });
}

$(document).ready(function () {
    carregarAlunos();
});
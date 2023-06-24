function exportarAluno(nome, idade, turma, instituicao, descricao) {
    var element = document.createElement("div");
    element.classList.add("pdf-content");
    element.innerHTML = `
    <h2 class="text-center">${nome}</h2>
    <p class="text-center">Idade: ${idade}</p>
    <p class="text-center">Turma: ${turma}</p>
    <p class="text-center">Instituição: ${instituicao}</p>
    <p class="text-center">${descricao}</p>
  `;

    html2pdf().from(element).save("aluno.pdf");
}

function carregarAlunos() {
    fetch("https://json-server-production-f6c6.up.railway.app/alunos")
        .then((response) => response.json())
        .then((data) => {
            const container = $(".card-inner");

            if (data.length > 0) {
                const aluno = data[0];

                const alunoCard = $("<div>").addClass("card bg-light");

                const alunoCardBody = $("<div>").addClass("card-body");

                const row = $("<div>").addClass("row");

                const colImg = $("<div>").addClass("col-md-3");

                const img = $("<img>")
                    .attr("src", aluno.imagem)
                    .addClass("img img-rounded img-fluid");

                const colInfo = $("<div>").addClass("col-md-9");

                const infoContainer = $("<div>");

                const nome = $("<p>")
                    .addClass("text-secondary text-center")
                    .text(aluno.nome);

                const idade = $("<p>")
                    .addClass("text-secondary text-center")
                    .text("Idade: " + aluno.idade);

                const turma = $("<p>")
                    .addClass("text-secondary text-center")
                    .text("Turma: " + aluno.turma);

                const instituicao = $("<p>")
                    .addClass("text-secondary text-center")
                    .text("Instituição: " + aluno.instituicao);

                const descricao = $("<p>").html(
                    "<strong>Características:</strong><br>" + aluno.descricao
                );

                const botoes = $("<div>").addClass(
                    "d-flex justify-content-end mt-auto"
                );

                const editarLink = $("<a>")
                    .addClass("btn text-white btn-primary ml-2")
                    .on("click", () => {
                        editarAluno(aluno.id);
                    });

                const editarIcone = $("<i>").addClass("fa fa-pencil");

                const arquivoLink = $("<a>").addClass(
                    "btn text-white btn-primary ml-2"
                );

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
                downloadLink.append(downloadIcone);

                botoes.append(editarLink);
                botoes.append(downloadLink);

                colImg.append(img);

                colImg.append(nome);
                colImg.append(idade);
                colImg.append(turma);
                colImg.append(instituicao);

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
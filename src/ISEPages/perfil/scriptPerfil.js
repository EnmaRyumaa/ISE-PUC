function validate() {
  fetch(`https://json-server-production-f6c6.up.railway.app/user/${number}`)
  .then(response => response.json())
  .then(users => {
      switch (users.type) {
        case 'professor':
          window.location.href = `../professor/telaProfessores.html?id=${number}`;
          break;
        case 'responsavel':
          window.location.href = `../responsavel/telaResponsavel.html?id=${number}`;
          break;
        case 'coordenacao':
          window.location.href = `../coordenacao/telaCoordenacao.html?id=${number}`;
          break;
        default:
          alert('Tipo de usuário inválido');
      } 
    });
}

function preencherFormulario(users) {
    document.getElementById('inputNome').value = users.name;
    document.getElementById('inputEmail').value = users.email;
    document.getElementById('inputSobrenome').value = users.lastName;
}

function habilitarEdicao() {
    document.getElementById('inputNome').removeAttribute('disabled');
    document.getElementById('inputEmail').removeAttribute('disabled');
    document.getElementById('inputSobrenome').removeAttribute('disabled');
}
function desabilitarEdicao() {
  document.getElementById('inputNome').disabled=true;
  document.getElementById('inputEmail').disabled=true;
  document.getElementById('inputSobrenome').disabled=true;
}

function atualizarDados() {
    var nome = document.getElementById('inputNome').value;
    var email = document.getElementById('inputEmail').value;
    var sobrenome = document.getElementById('inputSobrenome').value;
  
    var dadosAtualizados = {
      name: nome,
      email: email,
      lastName: sobrenome
    };

    fetch(`https://json-server-production-f6c6.up.railway.app/user/${number}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosAtualizados)
    })
      .then(response => response.json())
      .then(users => {
        desabilitarEdicao();
        alert('Dados atualizados:', users);
      })
      .catch(error => {
        console.error('Erro ao atualizar os dados:', error);
    });
}

//Coletando id da URL
var url = window.location.href;
var paramIndex = url.indexOf('id=');

if (paramIndex !== -1) {
  var number = url.substring(paramIndex + 3);

} else {
  console.log("O parâmetro 'id' não foi encontrado na URL");
}

fetch(`https://json-server-production-f6c6.up.railway.app/user/${number}`)
.then(response => response.json())
.then(users => preencherFormulario(users));

document.getElementById('btnInsert').addEventListener('click', atualizarDados);
document.getElementById('btnUpdate').addEventListener('click', habilitarEdicao);


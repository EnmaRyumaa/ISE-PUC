const recoverEmail = document.getElementById('email');
const recoverButton = document.getElementById('button');
const recoverSenha = document.getElementById('password');
const recoverSenhaConf = document.getElementById('passwordConf');
const recoverButtonSenha = document.getElementById('buttonSenha');

recoverButton.addEventListener('click', function (event) {
  event.preventDefault();
  validateEmailInAPI();
});

recoverButtonSenha.addEventListener('click', function (event) {
  event.preventDefault();
  substituirSenhaNaAPI();
});

async function substituirSenhaNaAPI() {
  const novaSenha = recoverSenha.value;
  const confirmacaoSenha = recoverSenhaConf.value;

  if (novaSenha === confirmacaoSenha) {
    try {
      const number = await validateEmailInAPI();

      if (number !== -1) {
        const response = await fetch(
          `https://api-json-server-tiaw.vercel.app/user/${number}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: novaSenha }),
          }
        );

        if (response.ok) {
          console.log('Senha do usuário atualizada com sucesso!');
          window.location.href = 'RecuperacaoSenhaAux.html';
        } else {
          console.log('Erro ao atualizar a senha do usuário:', response.status);
        }
      } else {
        console.log('Email não encontrado.');
      }
    } catch (error) {
      console.log('Erro ao realizar a solicitação para atualizar a senha:', error);
    }
  } else {
    console.log('A nova senha e a confirmação da senha não correspondem.');
  }
}

async function validateEmailInAPI() {
  const emailInserted = recoverEmail.value;

  try {
    const response = await fetch('https://api-json-server-tiaw.vercel.app/user');
    const users = await response.json();

    for (let i = 0; i < users.length; i++) {
      if (emailInserted === users[i].email) {
        alert('Email existente');
        window.location.href = "RecuperacaoSenhaAux.html";
        return users[i].id;
      }
    }

    alert('Email não encontrado');
    return -1;
  } catch (error) {
    alert('Erro ao obter os dados dos usuários');
    console.log(error);
    return -1;
  }
}
const recoverEmail = document.getElementById('email');
const recoverButton = document.getElementById('button');
const recoverSenha = document.getElementById('password');
const recoverSenhaConf = document.getElementById('passwordConf');
const recoverButtonSenha = document.getElementById('buttonSenha');

console.log(recoverButton);

recoverButton.addEventListener('click', () => {
    validateEmailInAPI();
});

console.log(recoverEmail);

recoverButtonSenha.addEventListener('click', () => {
    substituirSenhaNaAPI();
});

async function substituirSenhaNaAPI() {
  const novaSenha = recoverSenha.value;
  const confirmacaoSenha = recoverSenhaConf.value;

  if (novaSenha === confirmacaoSenha) {
    try {
      const userData = await getUsersFromAPI();
      const emailInserted = recoverEmail.value;

      if (userData) {
        for (let i = 0; i < userData.length; i++) {
          if (emailInserted === userData[i].email) {
            const response = await fetch(
              `https://json-server-production-f6c6.up.railway.app/user/${userData[i].id}`,
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
            return;
          }
        }
        console.log('Email não encontrado.');
      } else {
        console.log('Nenhum dado de usuário encontrado na API.');
      }
    } catch (error) {
      console.log('Erro ao realizar a solicitação para atualizar a senha:', error);
    }
  } else {
    console.log('A nova senha e a confirmação da senha não correspondem.');
  }
}

async function getUsersFromAPI() {
  try {
    const response = await fetch('https://json-server-production-f6c6.up.railway.app/user');
    if (response.ok) {
      const users = await response.json();
      return users;
    } else {
      console.log('Erro ao obter os dados dos usuários:', response.status);
      return null;
    }
  } catch (error) {
    console.log('Erro ao obter os dados dos usuários:', error);
    return null;
  }
}

async function validateEmailInAPI() {
  const emailInserted = recoverEmail.value;

  try {
    const userData = await getUsersFromAPI();

    if (userData) {
      for (let i = 0; i < userData.length; i++) {
        if (emailInserted === userData[i].email) {
          alert('Email existente');
          window.location.href = 'RecuperacaoSenhaAux.html';
          return;
        }
      }
      alert('Email não encontrado');
    } else {
      console.log('Nenhum dado de usuário encontrado na API.');
    }
  } catch (error) {
    alert('Erro ao obter os dados dos usuários');
    console.log('Erro ao obter os dados dos usuários:', error);
  }
}

function validate() {
    let recoverEmail = document.getElementById('email').value;
    let recoverPassword = document.getElementById('password').value;
  
    fetch('https://json-server-production-f6c6.up.railway.app/user')
      .then(res => res.json())
      .then(users => {
        const escolheUser = users.find(user => user.email === recoverEmail && user.password === recoverPassword);
        if (escolheUser) {
          switch (escolheUser.type) {
            case 'professor':
              window.location.href = `../professor/telaProfessores.html?id=${escolheUser.id}`;
              break;
            case 'responsavel':
              window.location.href = `../responsavel/telaResponsavel.html?id=${escolheUser.id}`;
              break;
            case 'coordenacao':
              window.location.href = `../coordenacao/telaCoordenacao.html?id=${escolheUser.id}`;
              break;
            default:
              alert('Tipo de usuário inválido');
          }
        } else {
          alert('Usuário ou senha incorretos.');
        }
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
      });

  }

 
  
// Função para carregar os dados dos alunos
function carregarAlunos() {
    fetch('https://json-server-production-f6c6.up.railway.app/alunos')
      .then(response => response.json())
      .then(data => {
        // Faça algo com os dados obtidos, por exemplo:
        console.log(data);
      })
      .catch(error => {
        console.log('Ocorreu um erro:', error);
      });
  }
  
  // Chamar a função para carregar os alunos quando necessário
  carregarAlunos();
  
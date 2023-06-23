const recoverInputName = document.getElementById('firstname');
const recoverInputLastName = document.getElementById('lastname');
const recoverInputEmail = document.getElementById('email');
const recoverInputPassword = document.getElementById('password');
const recoverButtonCreate = document.getElementById('bt-create');
const recoverSelectUserType = document.getElementById('usertype');

const urlJSON = "https://api-json-server-tiaw.vercel.app/user";

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

recoverButtonCreate.addEventListener('click', async () => {
  await includeNewUser();
});

async function includeNewUser() {
  const objUser = await insertValuesInObject(
    recoverInputName,
    recoverInputLastName,
    recoverInputEmail,
    recoverInputPassword,
    recoverSelectUserType.value
  );

  if (validateIfFieldEmpty(objUser)) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (!validateEmail(objUser.email)) {
    alert("Por favor, insira um e-mail válido.");
    return;
  }

  const userExists = await validateUserInDB(objUser);
  if (userExists) {
    alert("Email e/ou senha já estão cadastrados.");
    return;
  }

  try {
    const response = await fetch(urlJSON, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(objUser)
    });

    if (response.ok) {
      alert('Usuário cadastrado com sucesso!');
    } else {
      throw new Error('Erro ao cadastrar usuário.');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao cadastrar usuário. Por favor, tente novamente.');
  }
}

function validateIfFieldEmpty(user) {
  for (let key in user) {
    if (user.hasOwnProperty(key) && user[key] === '') {
      return true;
    }
  }
  return false;
}

function validateEmail(email) {
  return emailRegex.test(email);
}

async function validateUserInDB(newUser) {
  try {
    const response = await fetch(urlJSON);
    const users = await response.json();

    return users.some(
      user => user.email === newUser.email || user.password === newUser.password
    );
  } catch (error) {
    console.error('Erro:', error);
    return false;
  }
}

async function insertValuesInObject(
  recoverInputName,
  recoverInputLastName,
  recoverInputEmail,
  recoverInputPassword,
  userType
) {
  let newUser = {
    name: recoverInputName.value,
    lastName: recoverInputLastName.value,
    email: recoverInputEmail.value,
    password: recoverInputPassword.value,
    type: userType
  };

  return newUser;
}
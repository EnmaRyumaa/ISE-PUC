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
    await delay(1000);

    const lastUser = await getLastUser();
    const lastUserID = lastUser ? lastUser.id : 0;

    objUser.id = lastUserID + 1;

    const response = await fetch(urlJSON, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(objUser)
    }).then(function () {
        location.reload();
        alert("Usuário cadastrado");
    });

  } catch (error) {
    console.error('Erro:', error);
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

async function getLastUser() {
  try {
    const response = await fetch(urlJSON);
    const users = await response.json();

    users.sort((a, b) => b.id - a.id);

    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Erro:', error);
    return null;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const recoverInputName = document.getElementById('firstname');
const recoverInputLastName = document.getElementById('lastname');
const recoverInputEmail = document.getElementById('email');
const recoverInputPassword = document.getElementById('password');
const recoverButtonCreate = document.getElementById('bt-create');

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

recoverButtonCreate.addEventListener('click', async () => {
    await includeNewUser();
});

async function insertValuesInObject(recoverInputName, recoverInputLastName, recoverInputEmail, recoverInputPassword) {
    let newUser = {
        name: recoverInputName.value,
        lastName: recoverInputLastName.value,
        email: recoverInputEmail.value,
        password: recoverInputPassword.value
    };

    console.log('press');

    return newUser;
}

async function includeNewUser() {
    let newStrUser = { user: [] };
    let objUser = await insertValuesInObject(
        recoverInputName,
        recoverInputLastName,
        recoverInputEmail,
        recoverInputPassword
    );

    newStrUser.user.push(objUser);
    console.log(newStrUser);

    if (validateIfFieldEmpty(objUser)) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (!validateEmail(objUser.email)) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    if (validateUserInDB(objUser)) {
        alert("Email e/ou senha já estão cadastrados.");
        return;
    }

    saveObjectInDB(newStrUser);
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

function validateUserInDB(newUser) {
    let existingData = localStorage.getItem('userData');
    if (existingData) {
        let existingUserArray = JSON.parse(existingData).user;

        return existingUserArray.some(user => user.email === newUser.email || user.password === newUser.password);
    }
    return false;
}

function saveObjectInDB(newStrUser) {
    let existingData = localStorage.getItem('userData');
    let existingUserArray = existingData ? JSON.parse(existingData).user : [];

    existingUserArray.push(...newStrUser.user);

    let updatedData = { user: existingUserArray };
    localStorage.setItem('userData', JSON.stringify(updatedData));

    console.log('Object saved in DB');
}
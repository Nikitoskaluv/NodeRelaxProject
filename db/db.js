const users = [
    { name: 'John', login: 'mail@mail.ru', password: '12345' },
    { name: 'Jim', login: 'mail1@mail.ru', password: 'are' },
    { name: 'Mona', login: 'mail2@mail.ru', password: 'test' }
]


export function findUserByLogin(login) {
    return users.find((user => user.login === login));
}

export function addUser(user) {
    try {
        users.push(user);
        return true;
    } catch (e) {
        console.error(e);
    }
    return false;
}



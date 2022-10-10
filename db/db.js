const DB_FILE = './users.json'

import * as fs from "fs";
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}
const users = JSON.parse(fs.readFileSync(DB_FILE));


export function findUserByLogin(login) {
    return users.find((user => user.login === login));
}

export function addUser(user) {
    try {
        users.push(user);
        fs.writeFileSync(DB_FILE, JSON.stringify(users));
        return true;
    } catch (e) {
        console.error(e);
    }
    return false;
}



import * as db from "../db/db.js";


export function registerUser(user) {
    const user_from_db = db.findUserByLogin(user.login);
    if (user_from_db) {
        return false;
    }
    return db.addUser(user);
}


export function authUser(user) {
    const user_from_db = db.findUserByLogin(user.login);
    if (!user_from_db) {
        return false;
    }
    if (user.password !== user_from_db.password) {
        return false;
    }
    return true;
}
export function getAllUsers() {
    return db.getAllUsers();
}
export function getUser(login) {
    return db.getUser(login);
}

export function updateUser(user) {
    if (db.updateUser(user)) {
        return db.updateUser(user);
    } else {
        return false;
    }
}

export function updateUserPassword(user) {
    if (db.updateUserPassword(user)) {
        return db.updateUserPassword(user);
    } else {
        return false;
    }
}








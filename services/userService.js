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
    console.log("DB", user_from_db)
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










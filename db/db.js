import { DB_FILE } from "../constants.js";
import { TIMER_DB_FILE } from "../constants.js";

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

export function getAllUsers() {
    return users;
}



if (!fs.existsSync(TIMER_DB_FILE)) {
    fs.writeFileSync(TIMER_DB_FILE, JSON.stringify([]));
}
const timers = JSON.parse(fs.readFileSync(TIMER_DB_FILE));

export function addTimer(timer) {
    try {
        timers.push(timer);
        fs.writeFileSync(TIMER_DB_FILE, JSON.stringify(timers));
        return true;
    } catch (e) {
        console.log(e);
    }
    return false;
}

export function getAllTimers() {
    return timers;
}

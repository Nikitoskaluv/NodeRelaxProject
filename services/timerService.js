import * as db from "../db/db.js";

export function saveTimer(timer) {
    return db.addTimer(timer);
}
export function getAllTimers() {
    return db.getAllTimers();
}
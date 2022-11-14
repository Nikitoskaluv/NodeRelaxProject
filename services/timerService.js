import * as db from "../db/db.js";

export function saveTimer(timer) {
    const timerFromDB = db.getTimerById(timer.id);
    if (timerFromDB) {
        return db.updateTimer(timer.id, timer);
    }

    return db.addTimer(timer);
}
export function getAllTimers() {
    return db.getAllTimers();
}
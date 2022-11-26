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

function constructStatObject(med, rst, wrk) {
    let timeObject = {};
    timeObject.meditation = med.length > 0 ? med.map(t => t.seconds).reduce((a, v) => a + v) : 0;
    timeObject.rest = rst.length > 0 ? rst.map(t => t.seconds).reduce((a, v) => a + v) : 0;
    timeObject.work = wrk.length > 0 ? wrk.map(t => t.seconds).reduce((a, v) => a + v) : 0;
    return timeObject;
}

export function getTimeObjectOfUser(login) {
    const allTimersOfUser = db.getAllTimersOfUser(login);

    const med = allTimersOfUser.filter(t => isSameDate(new Date(), new Date(t.createdAt))).filter(t => t.state == "FINISHED").filter(t => t.type === "meditation");
    const rst = allTimersOfUser.filter(t => isSameDate(new Date(), new Date(t.createdAt))).filter(t => t.state == "FINISHED").filter(t => t.type === "rest");
    const wrk = allTimersOfUser.filter(t => isSameDate(new Date(), new Date(t.createdAt))).filter(t => t.state == "FINISHED").filter(t => t.type === "work");

    return constructStatObject(med, rst, wrk)
}

function isSameDate(d1, d2) {
    const today = d1.setUTCHours(0, 0, 0, 0);
    const date = d2.setUTCHours(0, 0, 0, 0);
    return today == date;
}
function calculatePeriodStart(todayDate) {
    let weekDate = new Date();
    weekDate.setTime(todayDate.getTime() - (6 * 24 * 3600000));
    weekDate = weekDate.setUTCHours(0, 0, 0, 0);
    return weekDate;
}

export function getWeekStats(login) {
    const allTimersOfUser = db.getAllTimersOfUser(login);
    const periodStart = calculatePeriodStart(new Date());
    let weekFilteredArr = filterPeriodTimers(allTimersOfUser, periodStart);
    weekFilteredArr = weekFilteredArr.filter(t => t.state == "FINISHED");
    const arrayWithChangedTimeStamp = weekFilteredArr.map(t => ({ ...t, createdAtDate: (new Date(t.createdAt).setUTCHours(0, 0, 0, 0)) }));


    const groupBy = (array, key) => {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
                currentValue
            );
            return result;
        }, {});
    };
    const resultOfGroupe = groupBy(arrayWithChangedTimeStamp, 'createdAtDate');

    let result = [];
    for (let key of Object.keys(resultOfGroupe)) {
        let day = new Date(parseInt(key));
        let dayTimers = resultOfGroupe[key];
        let med = dayTimers.filter(t => t.type === "meditation");
        let rst = dayTimers.filter(t => t.type === "rest");
        let wrk = dayTimers.filter(t => t.type === "work");

        result.push({
            date: day,
            data: constructStatObject(med, rst, wrk)
        })
    }

    result = result.sort((v1, v2) => v1.date.getTime() - v2.date.getTime());
    result = replaceEmptyDates(result, periodStart);
    return result;

}

function filterPeriodTimers(arr, start) {
    let todayDate = new Date();
    todayDate = new Date().setUTCHours(23, 59, 59, 999);
    let a = arr.filter(object => {
        return object.createdAt >= start
    });
    return a;
}

function replaceEmptyDates(src, startDate) {

    let result = [];
    let currentDate = new Date(startDate).setUTCHours(0, 0, 0, 0);
    let todayDate = new Date().setUTCHours(0, 0, 0, 0);

    while (currentDate <= todayDate) {
        const date = new Date(currentDate);
        result.push({
            date: new Date(date.getTime()),
            data: {}
        });

        currentDate = new Date(date.setDate(date.getDate() + 1)).setUTCHours(0, 0, 0, 0);
    }

    for (let i = 0; i < result.length; i++) {
        let date = result[i].date;

        let value = src.find(item => item.date.getTime() == date.getTime());
        if (value) {
            result[i].data = value.data;
        } else {
            result[i].data = {
                'meditation': 0,
                'rest': 0,
                'work': 0
            }
        }
    }

    return result;
}




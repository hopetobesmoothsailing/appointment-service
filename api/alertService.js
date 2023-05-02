const CronJob = require('cron').CronJob;
const fs = require('fs')
const AppointmentLogs = require('../model/AppointmentLog')

const alertService = new CronJob("*/10 * * * * *",
    async () => {
        let alerts = [];
        await removeAppointmentLog()
        const alertsForDay = await alertBeforeOneDay()
        const alertsForHour = await alertBeforeTwoHours()
        alerts = [...(alertsForDay.map(i => i)), ...(alertsForHour.map(i => i))];
        // Here should be the code for notification service. It depends on the front end.
    }
)

alertService.start();

const removeAppointmentLog = async () => {
    await AppointmentLogs.deleteMany({slot: {$lte: formatDateTime()}})
}

const alertBeforeOneDay = async () => {
    const logs = await AppointmentLogs.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: 'id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $lookup: {
                from: 'doctors',
                localField: 'doctor_id',
                foreignField: 'id',
                as: 'doctor'
            }
        },
        {
            $unwind: '$doctor'
        },
        {
            $match: {
                slot: {$lte: formatDateTime(new Date(addOneDate()))},
                alert_count: 0
            }
        },
        {
            $project: {
                __v: 0,
            }
        }
    ])
    let alerts = [];
    logs.map(async log => {
        const message = `${formatDateTime()} | Привет ${log.user.name}! Напоминаем что вы записаны к ${log.doctor.spec} завтра в ${log.slot}!`
        alerts.push(message);
        await AppointmentLogs.updateOne({_id: log._id}, {alert_count: 1});
        await writeLogFile(message)
    })
    return alerts;
}

const alertBeforeTwoHours = async () => {
    const logs = await AppointmentLogs.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: 'id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $lookup: {
                from: 'doctors',
                localField: 'doctor_id',
                foreignField: 'id',
                as: 'doctor'
            }
        },
        {
            $unwind: '$doctor'
        },
        {
            $match: {
                slot: {$lte: formatDateTime(new Date(addTwoHours()))},
                alert_count: {$lt: 2}
            }
        },
        {
            $project: {
                __v: 0,
            }
        }
    ])
    let alerts = [];
    logs.map(async log => {
        const message = `${formatDateTime()} | Привет ${log.user.name}! Вам через 2 часа к ${log.doctor.spec} в ${log.slot}!`
        alerts.push(message);
        await AppointmentLogs.updateOne({_id: log._id}, {alert_count: 2});
        await writeLogFile(message)
    });
    return alerts;
}

const formatDateTime = (now = new Date()) => {
    return now.getUTCFullYear() + '-' + setPadding(now.getUTCMonth() + 1) + '-' + setPadding(now.getUTCDate()) + ' ' + setPadding(now.getUTCHours()) + ':' + setPadding(now.getUTCMinutes()) + ':' + setPadding(now.getUTCSeconds())
}

const addOneDate = () => {
    const now = new Date();
    return now.setUTCDate(now.getUTCDate() + 1)
}

const addTwoHours = () => {
    const now = new Date();
    return now.setUTCHours(now.getUTCHours() + 2)
}

const setPadding = (value) => {
    if (value.toString().length === 1) return '0' + value
    else return value
}

const writeLogFile = (content) => {
    const stream = fs.createWriteStream('alert.log', {flags: 'a'});
    stream.write(content);
    stream.end('\n');
}
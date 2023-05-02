const alertService = require('./alertService')
const Users = require("../model/User");
const Doctors = require("../model/Doctor");
const AppointmentLogs = require("../model/AppointmentLog");
exports.register_user = async (req, res) => {
    const id = req.body.user_id;
    const phone = req.body.phone;
    const name = req.body.name;
    const newUser = Users({
        id: id,
        phone: phone,
        name: name,
    });
    const result = await newUser.save();
    if (result !== undefined) {
        res.send({
            status: 'success'
        })
    } else {
        res.send({
            status: 'Error Found'
        })
    }
}

exports.register_doctor = async (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const spec = req.body.spec;
    const slots = JSON.parse(req.body.slots);
    const newDoctor = new Doctors({
        id: id,
        name: name,
        spec: spec,
        slots: slots
    });
    const result = newDoctor.save();
    if (result !== undefined) res.send({status: 'success'})
    else res.send({status: 'Error Found'})
}

exports.signup = async (req, res) => {
    const user_id = req.body.user_id;
    const doctor_id = req.body.doctor_id;
    const slot = req.body.slot;

    const userExists = await Users.exists({id: user_id});
    if (userExists === null) {
        res.send({
            status: 'failure',
            comment: 'You should register at first.'
        });
        return
    }
    const doctor = (await Doctors.find({id: doctor_id}, {_id: 0, __v: 0}).exec())[0];
    if (doctor === undefined) {
        res.send({
            status: 'failure',
            comment: 'The doctor has not registered yet.'
        })
        return
    }

    const log = await AppointmentLogs.find({doctor_id: doctor_id, slot: slot}).exec();
    if (log.length > 0) {
        res.send({
            status: 'failure',
            comment: `The doctor has already made an appointment at ${slot}. Please try at another time.`
        });
    } else {
        if (!doctor.slots.includes(slot)) {
            res.send({
                status: 'failure',
                comment: 'At this time the doctor is not available.'
            })
            return
        }
        const newAppointment = AppointmentLogs({
            user_id: user_id,
            doctor_id: doctor_id,
            slot: slot,
            alert_count: 0,
            created_at: new Date()
        });
        const result = await newAppointment.save();
        if (result !== undefined) res.send({status: 'success'})
        else res.send({status: 'error', comment: 'You should try again.'})
    }
}
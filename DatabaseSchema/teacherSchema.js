const moongose = require('mongoose');
let teacherSchema = new moongose.Schema({   
    teacherName: {
        type: String,
        required: true
    },
    teacherShort: {
        type: String,
        required: true
    },
    teacherSubject: {
        type: Array,
        required: true
    },
    teacherStandard: {
        type: Array,
        required: true
    },
    totalSubjects: {
        type: Number,
    },totalStandards: {
        type: Number,
    },  
});

module.exports = { teacherSchema };
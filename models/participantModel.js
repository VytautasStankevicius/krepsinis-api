const mongoose = require("mongoose")

const ParticipantSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Please enter participants name"],
        min: [2, 'Use more then two symbols please'],
        match: [/^[a-zA-Z\s]+$/, 'Only letters and spaces are allowed in this field']
    },
    lastName:{
        type:String,
        required:[true, 'Please enter participants last name'],
        min: [2, 'Use more then two symbols please'],
        match: [/^[a-zA-Z\s]+$/, 'Only letters and spaces are allowed in this field']
    },
    age:{
        type:Number,
        required:[true, "Please enter participants age"],
        min:[18, "Participant must be 18 or older"],
        max:[40, "Participant must be 40 or younger"]
    },
    ranking:{
        type:Number,
        required:[true, 'A participant must have a ranking'],
        min:[1, "Please enter a number from 1 to 5"],
        max:[5, "Please enter a number from 1 to 5"]
    },
    team:{
        type:String,
        required:[true, "A participant needs to enter his teams name"],
        match: [/^[a-zA-Z0-9\s]+$/, 'Only letters and spaces are allowed in this field']
    }
})

const Participant = mongoose.model('Participant', ParticipantSchema)

module.exports = Participant
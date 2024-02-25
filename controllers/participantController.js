const fs = require('fs')
const Participant = require('../models/participantModel')
const APIFeatures = require('../utils/apiTools')


// app.use((req, res, next) => {
//     req.query.limit = req.query.limit ||  10;
//     req.query.sort = req.query.sort || "-ranking";
//     req.query.fields = req.query.fields || "ranking,name,lastName,team";
//     req.query.ranking = req.query.ranking || { gte: "1", lte: "5" };
//     next();
// });


//middleware---------------------------------------------------------
exports.searchTeam = (req, res, next) => { 
    const teamName = req.params.team;
    if (teamName) { req.query.team = teamName }
    req.query.sort = "name";
    req.query.fields = "age,ranking,name,lastName,team";
    next();
};

exports.topParticipants = (req, res, next) => {
    req.query.limit = "10"; 
    req.query.sort = "-ranking";
    req.query.fields = "ranking,name,lastName,team";
    req.query.ranking = { gte: "1", lte: "5" }; 
    next();
};

exports.topYoungestParticipants = (req, res, next) => { 
    req.query.sort = "age";
    req.query.fields = "age,ranking,name,lastName,team";
    req.query.age = { lte: "20" }; 
    next();
};
//--------------------------------------------------------------------
exports.allParticipants = async (req, res) => {
    try {
        const participantsData = new APIFeatures(Participant.find(), req.query)
            .filter()
            .sort({name:  1})
            .limitFields()
            .paginate();
        const participants = await participantsData.query.exec();
        const totalCount = await Participant.countDocuments();
        const totalPages = participantsData.totalPages;
        res.status(200).json({
            status: "All participant data rendered successfully",
            results: participants.length,
            page: participantsData.page,
            totalPages: totalPages,
            data: { participants }
        });
    } catch (err) {
        res.status(500).json({
            status: "Failed",
            message: err.message
        });
    }
};

exports.participantEntry = async (req, res) =>{
    try{
        const newParticipant = await Participant.create(req.body)
        res.status(201).json({
            status: "Success",
            message: "New participant created successfully",
            data: {newParticipant}
        })
    }catch(err){
        res.status(404).json({
            status: "Failed",
            message:err
        })
    }
}

exports.searchParticipant = async (req, res)=>{
    try{
        const participant = await Participant.findById(req.params.id)
        res.status(200).json({
            status: "Success",
            data: {participant}
        })
    }catch(err){
        res.status(404).json({
            status: "Failed",
            message:err
        })
    }
}

exports.updateParticipant = async (req, res) =>{
    try{
        const participant = await Participant.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators: true
        })
        res.status(200).json({
            status: "Success",
            message: "Participant information updated successfully",
            data: {participant}
        })
    }catch(err){
        res.status(404).json({
            status: "Failed",
            message:err
        })
    }
}

exports.deleteParticipant = async (req, res) =>{
    try{
        await Participant.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: "Success",
            message: "Participant information deleted successfully",
            data: null
        })
    }catch(err){
        res.status(404).json({
            status: "Failed",
            message:err
        })
    }
}

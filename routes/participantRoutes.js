const express = require('express');
const router = express.Router();
const participantController = require("../controllers/participantController")
const authController = require('../controllers/authController')

router.route("/")
.get(authController.protect, participantController.allParticipants)
.post(authController.protect, participantController.participantEntry)

router.route("/teamParticipants/:team")
.get(authController.protect,participantController.searchTeam, participantController.allParticipants)

router.route("/top10-participants")
.get(authController.protect,participantController.topParticipants, participantController.allParticipants)

router.route("/:id/card")
.get(authController.protect, participantController.searchParticipant)
.patch(authController.protect, participantController.updateParticipant)
.delete(authController.protect, participantController.deleteParticipant)

router.route("/Youngest-Participants")
.get(authController.protect,participantController.topYoungestParticipants, participantController.allParticipants)

module.exports = router
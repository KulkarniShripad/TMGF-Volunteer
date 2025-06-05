const express = require('express');
const router = express.Router();
const volunteerControllers = require('../controllers/volunteerControllers');

router.post('/' , volunteerControllers.createVolunteer);
router.get('/' , volunteerControllers.fetchVolunteers);
router.get('/:id', volunteerControllers.getById);
router.delete('/:id', volunteerControllers.deleteVolunteer);
router.post('/update-form' , volunteerControllers.updateVolunteer);

module.exports = router;
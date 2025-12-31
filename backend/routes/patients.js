const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/patientController');

router.post('/', auth, controller.createPatient);
router.get('/', auth, controller.getPatients);
router.get('/search', auth, controller.searchPatients);
router.get('/export/excel', auth, controller.exportExcel);
router.get('/:id', auth, controller.getPatient);
router.put('/:id', auth, controller.updatePatient);
router.delete('/:id', auth, controller.deletePatient);

module.exports = router;
const Patient = require('../models/Patient');
const Counter = require('../models/Counter');
const xlsx = require('xlsx');

async function getNextMR() {
  const name = 'patient_mr';
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const seq = counter.seq.toString().padStart(4, '0');
  return `MR-${seq}`;
}

exports.createPatient = async (req, res) => {
  try {
    const mrNo = await getNextMR();
    const data = { ...req.body, mrNo };
    const patient = new Patient(data);
    await patient.save();
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.searchPatients = async (req, res) => {
  try {
    const q = req.query.query || '';
    const regex = new RegExp(q, 'i');
    const results = await Patient.find({ $or: [{ mrNo: regex }, { name: regex }] }).limit(100);
    res.json(results);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ msg: 'Not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ msg: 'Not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.exportExcel = async (req, res) => {
  try {
    const patients = await Patient.find().lean();
    const sheetData = patients.map(p => ({
      MRNo: p.mrNo,
      Name: p.name,
      Age: p.age,
      Gender: p.gender,
      Phone: p.phone,
      Address: p.address,
      Diagnosis: p.diagnosis,
      Advice: p.advice,
      CreatedAt: p.createdAt,
    }));
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(sheetData);
    xlsx.utils.book_append_sheet(wb, ws, 'Patients');
    const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=patients.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
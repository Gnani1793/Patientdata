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

// Placeholder for SMS service
// SMS Service
const sendSMS = async (phone, message) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromPhone) {
      console.warn('Twilio credentials missing in .env. Mocking SMS.');
      console.log(`[Mock SMS] To: ${phone}, Message: ${message}`);
      return true; // Pretend it worked
    }

    // Format phone number to E.164 if not already (assuming IN for now if missing)
    let formattedPhone = phone;
    if (!phone.startsWith('+')) {
      formattedPhone = `+91${phone}`; // Default to India, or use a proper library if needed
    }

    const client = require('twilio')(accountSid, authToken);
    await client.messages.create({
      body: message,
      from: fromPhone,
      to: formattedPhone
    });
    console.log(`Twilio SMS sent to ${formattedPhone}`);
    return true;
  } catch (error) {
    console.error('Twilio Error:', error.message);
    return false;
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ msg: 'Not found' });
    res.json({ msg: 'Patient removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.createPatient = async (req, res) => {
  try {
    const mrNo = await getNextMR();
    const data = { ...req.body, mrNo };
    const patient = new Patient(data);
    await patient.save();

    // Send SMS
    try {
      const message = `Patient: ${patient.name} (MR: ${mrNo})\nDate: ${new Date(patient.date).toLocaleDateString()}\nComplaint: ${patient.complaint}\nDiagnosis: ${patient.diagnosis}\nAdvice: ${patient.advice}\n\nThank you for visiting Sri Satya Eye Care.`;
      await sendSMS(patient.phone, message);
    } catch (smsError) {
      console.error('SMS Failed:', smsError);
    }

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

    // Send SMS
    try {
      const message = `Update for ${patient.name} (MR: ${patient.mrNo})\nDiagnosis: ${patient.diagnosis}\nAdvice: ${patient.advice}\n\nSri Satya Eye Care.`;
      await sendSMS(patient.phone, message);
    } catch (smsError) {
      console.error('SMS Failed:', smsError);
    }

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
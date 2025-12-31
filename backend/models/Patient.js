const mongoose = require('mongoose');

const EyeSideSchema = new mongoose.Schema({
  va: String,
  refraction: String,
});

const EyeSideDetailedSchema = new mongoose.Schema({
  right: EyeSideSchema,
  left: EyeSideSchema,
});

const EyeSlitLampSchema = new mongoose.Schema({
  cornea: String,
  anteriorChamber: String,
  iris: String,
  lens: String,
  vitreous: String,
  other: String,
});

const PatientSchema = new mongoose.Schema({
  mrNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: Number,
  gender: String,
  phone: String,
  address: String,
  date: Date,
  complaint: String,
  medicalHistory: {
    diabetes: { type: Boolean, default: false },
    hypertension: { type: Boolean, default: false },
    heartDisease: { type: Boolean, default: false },
    glaucoma: { type: Boolean, default: false },
    allergies: { type: Boolean, default: false },
    medications: String,
    surgeries: String,
    familyHistory: String,
    other: String,
  },
  presentGlass: {
    right: {
      sph: String, cyl: String, axis: String, add: String, va: String, nv: String
    },
    left: {
      sph: String, cyl: String, axis: String, add: String, va: String, nv: String
    }
  },
  visualAcuity: {
    distance: EyeSideDetailedSchema,
    near: EyeSideDetailedSchema,
  },
  objectiveRefraction: {
    right: { sph: String, cyl: String, axis: String },
    left: { sph: String, cyl: String, axis: String }
  },
  subjectiveRefraction: {
    right: { sph: String, cyl: String, axis: String, va: String, add: String, nv: String },
    left: { sph: String, cyl: String, axis: String, va: String, add: String, nv: String }
  },
  slitLamp: {
    right: {
      lids: String, conjunctiva: String, cornea: String, anteriorChamber: String, pupil: String, iris: String, lens: String
    },
    left: {
      lids: String, conjunctiva: String, cornea: String, anteriorChamber: String, pupil: String, iris: String, lens: String
    }
  },
  fundus: String,
  diagnosis: String,
  advice: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Patient', PatientSchema);
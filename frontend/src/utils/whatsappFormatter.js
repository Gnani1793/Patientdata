export const formatPatientMessage = (patient) => {
    const na = 'NA';
    const check = (val) => val || na;
    const checkObj = (obj, field) => (obj && obj[field]) ? obj[field] : na;

    const dateStr = patient.date ? new Date(patient.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : na;

    // Header
    let msg = `*Sri Satya Eye Care and Opticals*\n`;
    msg += `Hiramandalam, Near RTC Bus Stand, Main Road\n`;
    msg += `Optometrist: DHARMANA KAMESWARA RAO (95736 93655)\n`;
    msg += `--------------------------------\n`;

    // Patient Details
    msg += `*PATIENT EXAMINATION REPORT*\n`;
    msg += `MR No: ${check(patient.mrNo)}\n`;
    msg += `Name: ${check(patient.name)}\n`;
    msg += `Age/Gender: ${check(patient.age)} / ${check(patient.gender)}\n`;
    msg += `Phone: ${check(patient.phone)}\n`;
    msg += `Address: ${check(patient.address)}\n`;
    msg += `Date: ${dateStr}\n`;
    msg += `--------------------------------\n\n`;

    // Complaint & History
    msg += `*Chief Complaint:* ${check(patient.complaint)}\n\n`;

    // Medical History - only show if exists or just say NA? User wanted EVERYTHING to be sent.
    //Receipt logic: if no significant history, says "No significant medical history".
    const history = [];
    if (patient.medicalHistory?.diabetes) history.push('Diabetes');
    if (patient.medicalHistory?.hypertension) history.push('Hypertension');
    if (patient.medicalHistory?.heartDisease) history.push('Heart Disease');
    if (patient.medicalHistory?.glaucoma) history.push('Glaucoma');
    if (patient.medicalHistory?.allergies) history.push('Allergies');
    if (patient.medicalHistory?.medications) history.push(`Meds: ${patient.medicalHistory.medications}`);
    if (patient.medicalHistory?.surgeries) history.push(`Surg: ${patient.medicalHistory.surgeries}`);
    if (patient.medicalHistory?.familyHistory) history.push(`Fam: ${patient.medicalHistory.familyHistory}`);
    if (patient.medicalHistory?.other) history.push(`Other: ${patient.medicalHistory.other}`);

    msg += `*Systemic Diseases:* ${history.length > 0 ? history.join(', ') : 'No significant medical history'}\n\n`;

    // Visual Acuity
    msg += `*Visual Acuity*\n`;
    msg += `Dist (R): ${checkObj(patient.visualAcuity?.distance?.right, 'va')} | (L): ${checkObj(patient.visualAcuity?.distance?.left, 'va')}\n`;
    msg += `Near (R): ${checkObj(patient.visualAcuity?.near?.right, 'va')} | (L): ${checkObj(patient.visualAcuity?.near?.left, 'va')}\n\n`;

    // Present Glasses
    if (patient.presentGlass) {
        msg += `*Present Glasses*\n`;
        const pg = patient.presentGlass;
        msg += `RE: ${check(pg.right?.sph)}/${check(pg.right?.cyl)} x ${check(pg.right?.axis)} (VA: ${check(pg.right?.va)})\n`;
        msg += `LE: ${check(pg.left?.sph)}/${check(pg.left?.cyl)} x ${check(pg.left?.axis)} (VA: ${check(pg.left?.va)})\n`;
        msg += `Add: R ${check(pg.right?.add)} | L ${check(pg.left?.add)}\n\n`;
    }

    // Objective Refraction (AR)
    if (patient.objectiveRefraction) {
        msg += `*Objective Refraction*\n`;
        const obj = patient.objectiveRefraction;
        msg += `RE: ${check(obj.right?.sph)}/${check(obj.right?.cyl)} x ${check(obj.right?.axis)}\n`;
        msg += `LE: ${check(obj.left?.sph)}/${check(obj.left?.cyl)} x ${check(obj.left?.axis)}\n\n`;
    }

    // Subjective Refraction
    if (patient.subjectiveRefraction) {
        msg += `*Subjective Refraction*\n`;
        const sub = patient.subjectiveRefraction;
        msg += `RE: ${check(sub.right?.sph)}/${check(sub.right?.cyl)} x ${check(sub.right?.axis)} (VA: ${check(sub.right?.va)})\n`;
        msg += `LE: ${check(sub.left?.sph)}/${check(sub.left?.cyl)} x ${check(sub.left?.axis)} (VA: ${check(sub.left?.va)})\n`;
        msg += `Add: R ${check(sub.right?.add)} | L ${check(sub.left?.add)}\n\n`;
    }

    // Slit Lamp
    if (patient.slitLamp) {
        msg += `*Slit Lamp*\n`;
        const sl = patient.slitLamp;
        const fields = ['lids', 'conjunctiva', 'cornea', 'anteriorChamber', 'pupil', 'iris', 'lens'];

        msg += `_Right Eye:_\n`;
        fields.forEach(f => {
            if (sl.right && sl.right[f]) msg += `${f}: ${sl.right[f]}\n`;
            else msg += `${f}: NA\n`;
        });

        msg += `_Left Eye:_\n`;
        fields.forEach(f => {
            if (sl.left && sl.left[f]) msg += `${f}: ${sl.left[f]}\n`;
            else msg += `${f}: NA\n`;
        });
        msg += `\n`;
    } else {
        msg += `*Slit Lamp:* NA\n\n`;
    }

    // Fundus
    msg += `*Fundus:* ${check(patient.fundus)}\n`;

    // Diagnosis & Advice
    msg += `*Diagnosis:* ${check(patient.diagnosis)}\n`;
    msg += `*Advice:* ${check(patient.advice)}\n\n`;

    msg += `--------------------------------\n`;
    msg += `This is a computer generated report.`;

    return msg;
};

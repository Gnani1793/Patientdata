# Sri Satya Eye Care and Opticals — Patient Management

This repository contains a full-stack patient management application for "Sri Satya Eye Care and Opticals".

Folders:
- `backend/`: Node.js + Express + MongoDB API
- `frontend/`: React + Tailwind + Framer Motion UI

Clinic details (use exactly):

- Clinic Name: Sri Satya Eye Care and Opticals
- Clinic Address: Hiramandalam, Near RTC Bus Stand, Main Road, Hiramandalam
- Doctor Name: Dr. Dharmana Kamesh
- Doctor Phone Number: 95736 93655

Quick setup

1. Start MongoDB (e.g., `mongod`).
2. Backend:
   - cd backend
   - copy `.env.example` to `.env` and adjust values
   - npm install
   - npm run dev

3. Frontend:
   - cd frontend
   - npm install
   - npm start

Default login:
- Username: `Gnani`
- Password: `gnani1793`

Notes:
- Backend issues JWT tokens; frontend stores token in `localStorage`.
- Excel export endpoint: `GET /api/patients/export/excel` (protected).
- Print receipts use `react-to-print`.
- MR numbers auto-generated as MR-0001, etc.
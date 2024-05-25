const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

// In-memory data store for demonstration purposes
const teamMembers = [];

// Endpoint for individual team member
app.post('/team', (req, res) => {
  const { name, phone, address, license, service } = req.body;
  const teamMember = { name, phone, address, license, service };
  teamMembers.push(teamMember);
  res.status(201).json(teamMember);
});

// Endpoint to get all team members
app.get('/team', (req, res) => {
  res.status(200).json(teamMembers);
});

// Endpoint for bulk team members upload
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const workbook = xlsx.read(file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  data.forEach(item => {
    const { name, phone, address, license, service } = item;
    const teamMember = { name, phone, address, license, service };
    teamMembers.push(teamMember);
  });

  res.status(201).json(teamMembers);
});

app.use('/', (req,res)=>{
  res.sendFile(path.join(__dirname, 'index.html'));
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
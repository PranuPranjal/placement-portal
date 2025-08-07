const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/companyRoutes');
const branchRoutes = require('./routes/branchRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploadcv', express.static(path.join(__dirname, '../UploadCV')));
app.use('/uploadphoto', express.static(path.join(__dirname, '../UploadPhoto')));
app.use('/uploadaadhar', express.static(path.join(__dirname, '../UploadAadhar')));
app.use('/uploadugmarks', express.static(path.join(__dirname, '../UploadUGMarksheet')));
app.use('/uploadxmarks', express.static(path.join(__dirname, '../UploadXMarksheet')));
app.use('/uploadxiimarks', express.static(path.join(__dirname, '../UploadXIIMarksheet')));

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/branches', branchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

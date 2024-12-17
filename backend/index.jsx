const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.post('/api/employees', (req, res) => {
    const { employee_id, name, email, phone, department, date_of_joining, role } = req.body;

    if (!employee_id || !name || !email || !phone || !department || !date_of_joining || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const formattedDate = new Date(date_of_joining).toISOString().split('T')[0];

    const sqlCheck = 'SELECT * FROM employees WHERE employee_id = ? OR email = ?';
    db.query(sqlCheck, [employee_id, email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (result.length > 0) {
            return res.status(400).json({ message: 'Employee ID or Email already exists' });
        }

        const sqlInsert = `INSERT INTO employees (employee_id, name, email, phone, department, date_of_joining, role)
                           VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(
            sqlInsert,
            [employee_id, name, email, phone, department, formattedDate, role],
            (err, result) => {
                if (err) {
                    console.error("Error inserting data:", err);
                    return res.status(500).json({ message: 'Error inserting employee data', error: err });
                }
                res.status(200).json({ message: 'Employee added successfully' });
            }
        );
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
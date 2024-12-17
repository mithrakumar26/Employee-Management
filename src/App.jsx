import React from 'react';
import EmployeeForm from './components/EmployeeForm';
import './style.css';

const App = () => (
    <div style={{ background: '#f0f8ff', minHeight: '100vh', padding: '2rem' }}>
        <h1 style={{ color: '#1e90ff', textAlign: 'center' }}>Employee Management System</h1>
        <EmployeeForm />
    </div>
);

export default App;
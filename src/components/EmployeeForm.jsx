import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    employee_id: yup
        .string()
        .max(10, 'Employee ID must be at most 10 characters')
        .required('Employee ID is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().matches(/^\d{10}$/, 'Phone must be 10 digits').required('Phone is required'),
    department: yup.string().required('Department is required'),
    date_of_joining: yup
        .date()
        .max(new Date(), 'Date of joining cannot be in the future')
        .required('Date of joining is required'),
    role: yup.string().required('Role is required')
});

const EmployeeForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async data => {
        try {
            data.date_of_joining = new Date(data.date_of_joining).toISOString().split('T')[0];
            const response = await axios.post(process.env.REACT_APP_API_URL, data);
            alert(response.data.message);
            reset();
        } catch (error) {
            alert(error.response?.data?.message || 'An error occurred while submitting the form');
        }
    };    

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
                maxWidth: '500px',
                margin: 'auto',
                padding: '1rem',
                background: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
        >
            <div style={{ marginBottom: '1rem' }}>
                <label>Name:</label>
                <input {...register('name')} />
                <p>{errors.name?.message}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>Employee ID:</label>
                <input {...register('employee_id')} />
                <p>{errors.employee_id?.message}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>Email:</label>
                <input {...register('email')} />
                <p>{errors.email?.message}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>Phone:</label>
                <input {...register('phone')} />
                <p>{errors.phone?.message}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>Department:</label>
                <select {...register('department')}>
                    <option value="">Select</option>
                    <option value="HR">HR</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                </select>
                <p>{errors.department?.message}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>Date of Joining:</label>
                <input type="date" {...register('date_of_joining')} />
                <p>{errors.date_of_joining?.message}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>Role:</label>
                <input {...register('role')} />
                <p>{errors.role?.message}</p>
            </div>
            <button type="submit" style={{ background: '#1e90ff', color: '#fff', padding: '0.5rem 1rem' }}>
                Submit
            </button>
            <button type="button" onClick={() => reset()} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
                Reset
            </button>
        </form>
    );
};

export default EmployeeForm;
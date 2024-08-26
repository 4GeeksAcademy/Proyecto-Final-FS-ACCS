import React, { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Context } from "../store/appContext";

export const Change_password = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        try {
            const baseUrl = process.env.BACKEND_URL;
            const response = await fetch(baseUrl + '/api/changepassworduser', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Enviar el token en la cabecera
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.msg);
                setError('');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(data.msg || 'An error occurred');
                setMessage('');
            }
        } catch (err) {
            setError('An error occurred');
            setMessage('');
        }
    };

    return (
        <div className="container" style={{ width: '50vw', marginTop: '55px' }}>
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                {error && <div className="text-danger">{error}</div>}
                {message && <div className="text-success">{message}</div>}
                <button type="submit" className="btn btn-primary">Reset Password</button>
            </form>
        </div>
    );
};
import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

export const Change_password = () => {
    const { store, actions } = useContext(Context);
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
    
            const result = await actions.changePassword(currentPassword, newPassword);
            if (result) {
                setMessage('Password updated successfully.');
                setError('');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError('An error occurred while updating the password.');
                setMessage('');
            }
        } catch (err) {
            setError('An error occurred.');
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
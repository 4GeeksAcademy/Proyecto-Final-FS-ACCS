import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Context } from "../store/appContext";

export const Reset_password = () => {
    const {actions} = useContext(Context);
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            // Llama a la acción resetPassword para restablecer la contraseña
            const result = await actions.resetPassword(email,newPassword);
            if (result.success) {
                setSuccess("Password updated successfully.");
                setTimeout(() => navigate('/'), 2000);
            } else {
                setError("Failed to update password.");
            }
        } catch (err) {
            setError("An error occurred.");
        }
    };

    return (
        <div style={{ backgroundColor: '#B4E49D', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="container" style={{ width: '80vw', maxWidth: '500px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginTop: '55px' }}>
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', borderRadius: '10px', border: '1px solid #B4E49D', padding: '10px' }}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{ width: '100%', borderRadius: '10px', border: '1px solid #B4E49D', padding: '10px' }}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: '100%', borderRadius: '10px', border: '1px solid #B4E49D', padding: '10px' }}
                            required
                        />
                    </div>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {success && <div style={{ color: 'green' }}>{success}</div>}
                    <button
                        type="submit"
                        style={{ backgroundColor: '#B4E49D', border: 'none', borderRadius: '10px', padding: '10px', color: 'white' }}
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

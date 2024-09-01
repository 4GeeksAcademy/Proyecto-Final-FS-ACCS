import React, { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/reset_password.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Context } from "../store/appContext";

export const Reset_password = () => {
    const { store, actions } = useContext(Context);
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    async function submitForm(e) {
        e.preventDefault();
        let formData = new FormData(e.target);
        let password = formData.get("password");
        let passwordConfirm = formData.get("passwordConfirm");

        if (password === passwordConfirm) {
            let baseUrl = process.env.BACKEND_URL;
            let resp = await fetch(baseUrl + "/api/changepassword", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + params.get("token")
                },
                body: JSON.stringify({ password })
            });

            if (resp.ok) {
                console.log("Password changed");
                navigate("/login");
            }
        } else {
            console.log("Invalid Password");
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="reset-password">
            <div className="reset-password-container">
                <h2>Reset Password</h2>
                
                <form onSubmit={submitForm}>
                    <div className="mb-3 reset-password-form">
                        <label>New Password</label>
                        <div className="position-relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                            />
                            <i
                                className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} position-absolute`}
                                style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color:'#075E81' }}
                                onClick={togglePasswordVisibility}
                            ></i>
                        </div>
                    </div>
                    <div className="mb-3 reset-password-form">
                        <label>Confirm Password</label>
                        <div className="position-relative">
                            <input
                                name="passwordConfirm"
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                            />
                            <i
                                className={`fa-solid ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"} position-absolute`}
                                style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color:'#075E81' }}
                                onClick={toggleConfirmPasswordVisibility}
                            ></i>
                        </div>
                        <div id="emailHelp" className="reset-password-form-text">Confirm your password</div>
                    </div>
                    
                    <button type="submit" className="reset-password-form-btn">Reset Password</button>
                </form>
            </div>
        </div>
    );
};
import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";

import user1 from "../../img/user1.png";
import bebe1 from "../../img/bebe1.jpg";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/gestor_perfil.css";

export const Gestor_perfil = () => {
    const { actions, store } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const { userData, babies } = store;
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false); // Estado para manejar el modo de edición
    const [status, setStatus] = useState(""); // Estado para manejar mensajes de estado
    const [editableData, setEditableData] = useState({
        username: ""
    });

    useEffect(() => {
        if (!store.token) {
            navigate('/login');
            return;
        }
    }, [store.token, navigate]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                await actions.getUserInfo(); // Cargar datos del usuario
                await actions.getBabiesByUser(); // Cargar bebés del usuario
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user profile in useEffect:", error);
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, []);

    useEffect(() => {
        // Actualizar el estado del formulario cuando los datos del usuario se carguen
        if (userData) {
            setEditableData({
                username: userData.username,
            });
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData({
            ...editableData,
            [name]: value
        });
    };

    async function handleProfilePictureUpload(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        console.log("Loading...");
        const success = await actions.uploadProfilePicture(formData);
        if (success) {
            console.log("Picture Loaded");
        } else {
            console.log("Error uploading picture");
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const success = await actions.editUser(editableData);
        if (success) {
            setIsEditing(false);
            alert("Saved successfully");
        } else {
            alert("Error saving data");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>No user data found</div>;
    }


    return (
        <div className="container container-gestor-perfil" >
            <div className="gestor-perfil-img">
                <img src={(!store.profilePicture || store.profilePicture.includes("null")) ? user1 : store.profilePicture} className="gestor-perfil-img-perfil" alt="IMG_user" />
            </div>
            <div className="container-gestor-perfil-right">
                <div className="form-gestor-perfil">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={editableData.username}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="form-gestor-perfil">
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={userData.email}
                        readOnly
                    />
                </div>
                <div className="form-gestor-perfil">
                    <form onSubmit={handleProfilePictureUpload} style={{ display: 'flex', width: '100%' }}>
                        <div className="profile-picture-perfil">
                            <label htmlFor="formFile" className="form-label">Profile Picture</label>
                            <input
                                className="form-control"
                                type="file"
                                id="formFile"
                                name="profilePics"
                                disabled={!isEditing}
                            />
                            <button
                                type="submit"
                                className="ar-btn gestor-perfil-edit"
                                disabled={!isEditing}
                            >
                                Upload
                            </button>
                        </div>
                    </form>
                </div>

            <div className="form-gestor-perfil">
                <label>Password</label>
                <input
                    type="text"
                    name="password"
                    placeholder="Password"
                    value={userData.password}
                    readOnly

                />
            </div>
            <div className="form-gestor-perfil-reset">
                <Link to="/change_password">Want to reset your password?</Link>
            </div>

            <div className="d-flex justify-content-end btn-container-gestor-bebe">
                {isEditing ? (
                    <button
                        type="button"
                        onClick={handleSave}
                        className="btn gestor-perfil-edit"
                    >
                        Save
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="btn gestor-perfil-edit"
                    >
                        Edit
                    </button>
                )}
            </div>
            {status && <div className="status-message">{status}</div>}
            <div className="gestor-perfil-bebes">
                <label className="gestor-perfil-bebes-titulo">Babies</label>
                {babies.length > 0 ? (
                    <div className="gestor-perfil-bebes-bebe">
                        <ul className="gestor-perfil-baby-list">
                            {babies.map((baby) => (
                                <li key={baby.id} className="gestor-perfil-baby-list-item">
                                    <img src={baby.avatar_path || bebe1} alt={baby.name} className="baby-photo" />
                                </li>
                            ))}
                            <li>
                                <Link to="/add_baby" className="btn add-new-baby-text-gestor">
                                    +
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="gestor-perfil-bebes-no-found">No babies found</div>
                )}
            </div>

        </div>
        </div >
    );
};
import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";

import user1 from "../../img/user1.png";
import bebe1 from "../../img/bebe1.jpg";
import { Link } from "react-router-dom";
import "../../styles/gestor_perfil.css";

export const Gestor_perfil = () => {
    const { actions, store } = useContext(Context);
    const [loading, setLoading] = useState(true);

    const { user, babies } = store;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                await actions.getUserInfo(); 
                await actions.getBabiesByUser(); 
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user profile in useEffect:", error);
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>No user data found</div>;
    }


    return (
        <div className="container container-gestor-perfil" >
            <div className="gestor-perfil-img">
                <img src={user1} className="gestor-perfil-img-perfil" alt="IMG_user" />
            </div>
            <div className="container-gestor-perfil-right">
                <div className="form-gestor-perfil">
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Username" value={user.username} readOnly />
                </div>
                <div className="form-gestor-perfil">
                    <label>Email</label>
                    <input type="text" name="email" placeholder="email" value={user.email} readOnly />
                </div>
                <div className="form-gestor-perfil">
                    <label>Password</label>
                    <input type="text" name="password" placeholder="password" value={user.password} readOnly />
                </div>
                <div className="form-gestor-perfil-reset">
                    <Link to="/reset_password" >Want to reset your password?</Link>
                </div>
                <div>
                    <button type="submit" className="ar-btn gestor-perfil-edit">
                        Edit / Save
                    </button>
                </div>
                <div className="gestor-perfil-bebes">
                    <label className="gestor-perfil-bebes-titulo">Babies</label>
                    {/* Mostrar las fotos de los bebés */}
                    {babies.length > 0 ? (
                        <div className="gestor-perfil-bebes-bebe">
                            <ul className="gestor-perfil-baby-list">
                                {babies.map((baby) => (
                                    <li key={baby.id} className="gestor-perfil-baby-list-item">
                                        <img src={bebe1} alt={baby.name} className="baby-photo" />
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        to="/add_baby"
                                        className="btn add-new-baby-text-gestor"
                                    >
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

        </div>
    );
};

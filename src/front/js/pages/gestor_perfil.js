import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";

import user1 from "../../img/user1.png";
import { Link } from "react-router-dom";

export const Gestor_perfil = () => {
    const { actions, store } = useContext(Context);
    const [loading, setLoading] = useState(true);

    const { userData, babies } = store;
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                await actions.getUserProfileById(); // Cargar datos del usuario
                await actions.getBabiesByUserId(); // Cargar bebés del usuario
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user profile in useEffect:", error);
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [actions]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>No user data found</div>;
    }


    return (
        <div style={{backgroundColor: '#B4E49D'}}>
            <div className="container" style={{ width: '80vw', height: '80vw', backgroundColor: 'white', marginTop:'55px' }}>
                <div className="d-flex justify-content-center mb-3">
                    <img src={user1} className="img-fluid" alt="IMG_user" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}/>
                </div>
                <div className="d-flex flex-column justify-content-center">
                        <label>Username</label>
                        <input type="text" name="username" placeholder="Username" value={userData.username} style={{ backgroundColor: '#B4E49D', borderRadius: '10px', border:'none' }} readOnly/>
                </div>
                <div className="d-flex flex-column justify-content-center">
                        <label>Email</label>
                        <input type="text" name="email" placeholder="email" value={userData.email} style={{ backgroundColor: '#B4E49D', borderRadius: '10px', border:'none' }} readOnly/>
                </div>
                <div className="d-flex flex-column justify-content-center">
                    <label>Password</label>
                    <input type="text" name="password" placeholder="password" value={userData.password} style={{ backgroundColor: '#B4E49D', borderRadius: '10px', border:'none' }} readOnly />
                </div>
                <div className="mb-3">
                    <Link to="/reset_password" style={{ color: '#075E81', textDecoration: 'underline' }}>Want to reset your password?</Link>
                </div> 
                <div className="d-flex flex-column justify-content-center mt-3" style={{ borderRadius: '10px', padding: '10px', border: '2px solid #B4E49D' }}>
                        <label className="tituloApp">Babies</label>
                        {/* Mostrar los nombres de los bebés */}
                        {babies.length > 0 ? (
                            <ul>
                                {babies.map((baby) => (
                                    <li key={baby.id}>{baby.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <div>No babies found</div>
                        )}
                </div>

            </div>
        </div>
    );
};

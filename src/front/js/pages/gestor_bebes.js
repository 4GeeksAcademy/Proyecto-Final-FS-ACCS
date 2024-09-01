import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import bebe1 from "../../img/bebe1.jpg";
import "../../styles/gestor_bebes.css";

export const Gestor_bebes = () => {
    const { actions, store } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    const { babies } = store;

    useEffect(() => {
        const fetchBabies = async () => {
            try {
                if (!store.token) {
                    navigate('/login'); 
                } else {
                    await actions.getBabiesByUser();
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching babies in useEffect:", error);
                setLoading(false);
            }
        };
        fetchBabies();
    }, [store.token, actions, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-gestor-bebes">
            {babies.length > 0 ? (
                <ul>
                    {babies.map((baby) => (
                        <li key={baby.id} className="card-gestor-bebes">
                            <img
                                src={baby.photoUrl || bebe1}
                                alt={baby.name}
                            />
                            <span>{baby.name}</span>
                            <Link to={`/manage_baby/${baby.id}`}>
                                <div className="btn-edit-baby-gestor-bebes">Edit Baby</div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="no-babies-found">Add your baby now!</div>
            )}
            <div className="add-new-baby">
                <Link
                    to="/add_baby"
                    className="btn add-new-baby-text"
                >
                    +
                </Link>
                <div className="add-new-baby-text-2">Add Baby</div>
            </div>
        </div>
    );
};

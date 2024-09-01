import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import bebe1 from "../../img/bebe1.jpg";
import "../../styles/gestor_bebe.css";

export const Gestor_bebe = () => {
    const { id } = useParams();
    const { store, actions } = useContext(Context);
    const navigate = useNavigate(); 

    const { babyData } = store;

    const [editableData, setEditableData] = useState({
        name: "",
        gender: "",
        age: "",
        height: "",
        weight: ""
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!store.token) {
            navigate('/login'); 
        } else if (id) {
            actions.fetchBabyData(id); 
        }
    }, [id, store.token, navigate]);

    useEffect(() => {
        console.log("Received new babyData:", babyData);
        if (babyData) {
            setEditableData(babyData);
        }
    }, [babyData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableData({ ...editableData, [name]: value });
    };

    const handleSave = (event) => {
        event.preventDefault();
        actions.updateBabyData(editableData);
        setIsEditing(false);
        alert("Baby edited successfully!");
    };

    return (
        <div className="container-gestor-bebe">
            <div className="container-img-gestor-bebes">
                <div className="img-gestor-bebe-camara">
                    <svg width="128" height="106" viewBox="0 0 128 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M122.667 90.3333C122.667 93.1623 121.543 95.8754 119.543 97.8758C117.542 99.8762 114.829 101 112 101H16.0002C13.1712 101 10.4581 99.8762 8.45769 97.8758C6.4573 95.8754 5.3335 93.1623 5.3335 90.3333V31.6667C5.3335 28.8377 6.4573 26.1246 8.45769 24.1242C10.4581 22.1238 13.1712 21 16.0002 21H37.3335L48.0002 5H80.0002L90.6668 21H112C114.829 21 117.542 22.1238 119.543 24.1242C121.543 26.1246 122.667 28.8377 122.667 31.6667V90.3333Z" stroke="#B4E49D" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M64.0002 79.6667C75.7822 79.6667 85.3335 70.1154 85.3335 58.3333C85.3335 46.5513 75.7822 37 64.0002 37C52.2181 37 42.6668 46.5513 42.6668 58.3333C42.6668 70.1154 52.2181 79.6667 64.0002 79.6667Z" stroke="#B4E49D" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <img src={bebe1} className="img-gestor-bebe" alt="IMG_Baby" />
            </div>
            <div className="form-gestor-bebe">
                <label>Name</label>
                <input type="text" name="name" placeholder="Name" value={editableData.name} onChange={handleChange} disabled={!isEditing} className="form-control" />
            </div>
            <div className="form-gestor-bebe">
                <label>Gender</label>
                <input type="text" name="gender" placeholder="Gender" value={editableData.gender} onChange={handleChange} disabled={!isEditing} className="form-control" />
            </div>
            <div className="form-gestor-bebe">
                <label>Height</label>
                <div className="gestor-bebe-input-wrapper">
                    <input type="text" name="height" placeholder="Height" value={editableData.height} onChange={handleChange} disabled={!isEditing} className="form-control" />
                    <span className="gestor-bebe-unit">cm</span>
                </div>
            </div>
            <div className="form-gestor-bebe">
                <label>Age</label>
                <div className="gestor-bebe-input-wrapper">
                    <input type="text" name="age" placeholder="Age" value={editableData.age} onChange={handleChange} disabled={!isEditing} className="form-control" />
                    <span className="gestor-bebe-unit">months</span>
                </div>
            </div>
            <div className="form-gestor-bebe">
                <label>Weight</label>
                <div className="gestor-bebe-input-wrapper">
                    <input type="text" name="weight" placeholder="Weight" value={editableData.weight} onChange={handleChange} disabled={!isEditing} className="form-control" />
                    <span className="gestor-bebe-unit">kg</span>
                </div>
            </div>
            <div className="d-flex justify-content-end btn-container-gestor-bebe">
                {isEditing ? (
                    <button type="button" onClick={handleSave} className="btn btn-save-gestor-bebe">Save</button>
                ) : (
                    <button type="button" onClick={() => setIsEditing(true)} className="btn btn-edit-gestor-bebe">Edit</button>
                )}
                <Link to="/manage_babies">
                    <button type="button" className="btn btn-home-gestor-bebe">➜</button>
                </Link>
            </div>
        </div>
    );
};

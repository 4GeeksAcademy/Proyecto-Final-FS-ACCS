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
    const [status, setStatus] = useState(""); // Estado para manejar mensajes de estado (ej. "Cargando...")
    const [imageSrc, setImageSrc] = useState(bebe1);

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
            setImageSrc(babyData.avatar_path || bebe1);
        }
    }, [babyData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableData({ ...editableData, [name]: value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const success = await actions.updateBabyData(editableData);
        if (success) {
            alert("Baby edited successfully!");
            setIsEditing(false); // Cambia el estado a false después de mostrar la alerta
        } else {
            alert("Error saving data");
        }
    };

    async function handleUploadBabyPicture(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const success = await actions.uploadBabyPicture(id, formData);
            if (success) {
                setImageSrc(URL.createObjectURL(formData.get('babyPhoto')));
                alert("Picture uploaded successfully");
            } else {
                alert("Error uploading picture"); 
                console.error("Error uploading picture");
            }
        } catch (error) {
            alert("Error in handleUploadBabyPicture: " + error.message); 
            console.error("Error in handleUploadBabyPicture:", error);
        }
    }

    return (
        <div className="container-gestor-bebe">
            <div className="container-img-gestor-bebes">
                <img src={imageSrc} className="img-gestor-bebe" alt="IMG_Baby" />
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
            <div className="form-gestor-bebe form-picture">
                <form onSubmit={handleUploadBabyPicture} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <label htmlFor="formFile" className="form-label">Picture</label>
                    <input
                        className="form-control input-picture"
                        type="file"
                        id="formFile"
                        name="babyPhoto"
                        disabled={!isEditing}
                    />
                    <div className="btn-container">
                        <button
                            type="submit"
                            className="btn btn-upload-gestor-bebe"
                            disabled={!isEditing}
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
            {status && <div className="status-message">{status}</div>}
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
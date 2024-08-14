import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

import bebe1 from "../../img/bebe1.jpg";

export const Gestor_bebe = () => {
	const { store, actions } = useContext(Context);

	const { babyData } = store;

	const [editableData, setEditableData] = useState(babyData);
    const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
        // Obtener datos del bebé cuando se monta el componente
        actions.fetchBabyData();
    }, []);

	useEffect(() => {
        setEditableData(babyData);
    }, [babyData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableData({ ...editableData, [name]: value });
    };

	const handleSave = () => {
        actions.updateBabyData(editableData);
        setIsEditing(false);
    };

	return (
		<div className="container" style={{ width: '80vw', height: '80vw', backgroundColor: '#FBEE84' }}>
			<div className="d-flex justify-content-center align-items-center">
				<div>
					<img src={bebe1} className="img-fluid" alt="IMG_Baby"/>
				</div>
				<div className="d-flex flex-column justify-content-center" style={{ borderRadius: '10px', padding: '10px', border: '2px solid #63DDFC' }}>
					<label>Name</label>
					<input type="text" name="name" placeholder="Baby name" value={editableData.name} onChange={handleChange} disabled={!isEditing}/>
				</div>
			</div>
			
			<div>	
				<div className="d-flex flex-column justify-content-center">
					<label>Gender</label>
					<input type="text" name="gender" placeholder="Gender" value={editableData.gender} onChange={handleChange} disabled={!isEditing} style={{ backgroundColor: '#63DDFC', borderRadius: '10px', border:'none' }}/>
				</div>
				<div className="d-flex flex-column justify-content-center">
					<label>Height (cm)</label>
					<input type="text" name="height" placeholder="Height" value={editableData.height} onChange={handleChange} disabled={!isEditing} style={{ backgroundColor: '#63DDFC', borderRadius: '10px', border:'none' }}/> 
				</div>
				<div className="d-flex flex-column justify-content-center">
					<label>Age (months)</label>
					<input type="text" name="age" placeholder="Age" value={editableData.age} onChange={handleChange} disabled={!isEditing} style={{ backgroundColor: '#63DDFC', borderRadius: '10px', border:'none'}}/>
				</div>
				<div className="d-flex flex-column justify-content-center">
					<label>Weight (kg)</label>
					<input type="text" name="weight" placeholder="Weight" value={editableData.weight} onChange={handleChange} disabled={!isEditing} style={{ backgroundColor: '#63DDFC', borderRadius: '10px', border:'none'}}/>
				</div>
			</div>	
			{isEditing ? (
                <button onClick={handleSave} className="btn btn-primary mt-3">Save</button>
            ) : (
                <button onClick={() => setIsEditing(true)} className="btn btn-secondary mt-3">Edit</button>
            )}
			
			<Link to="/">
				<button className="btn btn-dark mt-3">Back home</button>
			</Link>
		</div>	
	);
};

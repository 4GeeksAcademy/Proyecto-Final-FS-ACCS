import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext';
import { Link, useNavigate } from 'react-router-dom';
import bebe1 from '../../img/bebe1.jpg';
import "../../styles/gestor_bebe.css";

export const Add_baby = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [babyData, setBabyData] = useState({
        name: '',
        gender: '',
        age: '',
        height: '',
        weight: '',
        photoUrl: ''
    });

    useEffect(() => {
        if (!store.token) {
            navigate('/login'); 
        }
    }, [store.token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBabyData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await actions.createBaby(babyData);
            if (success) {
                alert('Baby added successfully!');
                setBabyData({
                    name: '',
                    gender: '',
                    age: '',
                    height: '',
                    weight: '',
                    photoUrl: ''
                });
                navigate('/manage_babies'); 
            } else {
                alert('Failed to add baby');
            }
        } catch (error) {
            console.error("Error adding baby:", error);
        }
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
                <div className="img-gestor-bebe">
                    <img src={babyData.photoUrl || bebe1} className="img-fluid" alt="IMG_Baby" style={{borderRadius:"50%"}}/>
                </div>
            </div>
            <div className="d-flex flex-column justify-content-center">
                <form onSubmit={handleSubmit}>
                    <div className="form-gestor-bebe">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={babyData.name}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-gestor-bebe">
                        <label>Gender</label>
                        <input
                            type="text"
                            name="gender"
                            placeholder="Gender"
                            value={babyData.gender}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-gestor-bebe">
                        <label>Age</label>
                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={babyData.age}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-gestor-bebe">
                        <label>Height</label>
                        <input
                            type="number"
                            name="height"
                            placeholder="cm"
                            value={babyData.height}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-gestor-bebe">
                        <label>Weight</label>
                        <input
                            type="number"
                            name="weight"
                            placeholder="kg"
                            value={babyData.weight}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    {/* <div className="form-gestor-bebe">
                        <label>Photo URL</label>
                        <input
                            type="text"
                            name="photoUrl"
                            placeholder="Photo URL"
                            value={babyData.photoUrl}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div> */}
                    <div className="d-flex justify-content-end btn-container-gestor-bebe">
                        <button type="submit" className="btn btn-edit-gestor-bebe">Save</button>
                        <div>
                            <Link to="/manage_babies">
                                <button type="button" className="btn btn-home-gestor-bebe">➜</button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

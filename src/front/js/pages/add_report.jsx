import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPlus, faChartBar, faMoon, faUtensils, faBabyCarriage, faDroplet, faPills, faSchool, faBaby } from '@fortawesome/free-solid-svg-icons';
import { Context } from "../store/appContext"; // Importa el contexto para verificar autenticación
import "../../styles/add_report.css";


const CalendarPlaceholder = () => {
    return (
        <div className="card ar-calendar-card">
            <div className="ar-card-body">
                <h3><FontAwesomeIcon icon={faCalendar} /> Calendar</h3>
            </div>
        </div>
    );
};

const Switch = ({ checked, onChange }) => {
    return (
        <label className="switch">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />
            <span className="slider"></span>
        </label>
    );
};

export const AddReport = () => {
    const [babyName, setBabyName] = useState("");
    const [babies, setBabies] = useState([]);
    const [date, setDate] = useState("");
    const [bedtime, setBedtime] = useState("");
    const [meals, setMeals] = useState("");
    const [diapers, setDiapers] = useState("");
    const [walks, setWalks] = useState("");
    const [water, setWater] = useState("");
    const [meds, setMeds] = useState(false);
    const [kindergarden, setKindergarden] = useState(false);
    const [extra, setExtra] = useState("");
    const [error, setError] = useState("");
    const [selectedBabyId, setSelectedBabyId] = useState("");

    const { store, logout } = useContext(Context); 
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.token) {
            navigate('/login');
            return;
        }

        const fetchBabies = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}api/babies`, {
                    headers: {
                        'Authorization': `Bearer ${store.token}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch babies: ${errorText}`);
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setBabies(data);
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (error) {
                console.error('Error fetching babies:', error);
                setError('Error fetching baby names');
            }
        };

        fetchBabies();
    }, [store.token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedBabyId || !date || !bedtime || !meals || !diapers || !walks || !water) {
            setError("Please fill in all required fields.");
            return;
        }

        const reportData = {
            baby_id: parseInt(selectedBabyId, 10),
            date: date,
            bedtime: parseFloat(bedtime),
            meals: parseInt(meals, 10),
            diapers: parseInt(diapers, 10),
            walks: parseInt(walks, 10),
            water: parseFloat(water),
            meds: meds,
            kindergarden: kindergarden,
            extra: extra
        };

        try {
            const response = await fetch(`${process.env.BACKEND_URL}api/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${store.token}` 
                },
                body: JSON.stringify(reportData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                setError(`Error ${response.status}: ${errorText}`);
                return;
            }

            const result = await response.json();
            console.log('Report added successfully:', result);
            setError("");

        } catch (error) {
            setError('Network error: ' + error.message);
        }
    };

    return (
        <div className="ar-container" style={{ marginTop: '55px' }}>
            <div className="card ar-calendar-card">
                <div className="ar-card-body">
                    <CalendarPlaceholder />
                </div>
            </div>
            <div className="ar-form-card">
                <div className="ar-card-body">
                    {error && <div className="error">{error}</div>}
                    <form onSubmit={handleSubmit} className="ar-form-grid">
                        <div className="ar-column-one">
                            <div className="ar-form-group">
                                <label><FontAwesomeIcon icon={faBaby} /></label>
                                <select
                                    value={babyName}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setBabyName(name);

                                        const selectedBaby = babies.find(baby => baby.name === name);
                                        setSelectedBabyId(selectedBaby ? selectedBaby.id : "");
                                    }}
                                    required
                                >
                                    <option value="">Select a baby</option>
                                    {babies.map(baby => (
                                        <option key={baby.id} value={baby.name}>{baby.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="ar-form-group">
                                <label><FontAwesomeIcon icon={faCalendar} /></label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="ar-form-group">
                                <label>
                                    <FontAwesomeIcon icon={faMoon} />
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={bedtime}
                                    onChange={(e) => setBedtime(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="ar-form-group">
                                <label><FontAwesomeIcon icon={faUtensils} /></label>
                                <input
                                    type="number"
                                    value={meals}
                                    onChange={(e) => setMeals(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="ar-form-group">
                                <label>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 600"
                                        fill="currentColor"
                                        style={{ width: '44px', height: '44px' }}
                                    >
                                        <path d="M106.667,341.333c-15.04,0-29.611,4.117-43.307,12.267l-21.717,14.357c24.107,56,68.117,100.928,123.051,124.907l14.869-22.443C187.691,457.152,192,442.219,192,426.667C192,379.605,153.728,341.333,106.667,341.333z" />
                                        <path d="M426.667,234.667c0-11.776,9.536-21.333,21.333-21.333h42.667c-0.064-35.307-28.779-64-64.107-64H85.44c-35.328,0-64.043,28.693-64.107,64H64c11.797,0,21.333,9.557,21.333,21.333S75.797,256,64,256H21.333v14.037c0,19.221,2.432,37.888,6.571,55.872l12.8-8.448c20.949-12.48,43.456-18.795,65.963-18.795c70.592,0,128,57.408,128,128c0,23.211-6.613,46.251-19.115,66.667l-8.725,13.163c10.965,2.389,22.101,4.267,33.6,5.013c5.291,0.341,10.539,0.491,15.765,0.491c16.704,0,33.109-1.899,49.088-5.291l-8.384-12.672c-12.928-21.013-19.563-44.096-19.563-67.371c0-70.592,57.408-128,128-128c23.253,0,46.315,6.635,66.731,19.157l13.696,6.997c3.221-15.531,4.907-31.445,4.907-47.488V256H448C436.203,256,426.667,246.443,426.667,234.667z" />
                                        <path d="M320,426.667c0,15.595,4.331,30.549,12.864,44.416l14.741,22.251c25.024-10.624,48.341-25.536,68.843-44.757c24.768-23.211,43.819-51.52,56.469-82.432l-21.76-11.136C389.461,317.397,320,364.032,320,426.667z" />
                                    </svg>
                                </label>
                                <input
                                    type="number"
                                    value={diapers}
                                    onChange={(e) => setDiapers(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="ar-form-group">
                                <label><FontAwesomeIcon icon={faBabyCarriage} /></label>
                                <input
                                    type="number"
                                    value={walks}
                                    onChange={(e) => setWalks(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="ar-form-group">
                                <label><FontAwesomeIcon icon={faDroplet} /></label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={water}
                                    onChange={(e) => setWater(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="ar-column-two">
                            <div className="ar-switch-container">
                                <div className="ar-form-group">
                                    <label><FontAwesomeIcon icon={faPills} /></label>
                                    <Switch
                                        checked={meds}
                                        onChange={(e) => setMeds(e.target.checked)}
                                    />
                                </div>

                                <div className="ar-form-group ar-form-group-kinder">
                                    <label><FontAwesomeIcon icon={faSchool} /></label>
                                    <Switch
                                        checked={kindergarden}
                                        onChange={(e) => setKindergarden(e.target.checked)}
                                    />
                                </div>
                            </div>

                            <div className="ar-form-group textarea-group">
                                <label>Notes:</label>
                                <textarea
                                    value={extra}
                                    onChange={(e) => setExtra(e.target.value)}
                                ></textarea>
                            </div>

                            <button type="submit" className="ar-btn ar-btn-primary">
                                <FontAwesomeIcon icon={faPlus} /> Submit
                            </button>

                            <div className="ar-button-container">
                                <button
                                    onClick={() => navigate(`/average-report/${selectedBabyId}`)}
                                    className="ar-btn ar-btn-secondary"
                                    disabled={!selectedBabyId} 
                                >
                                    <FontAwesomeIcon icon={faChartBar} /> Report
                                </button>
                                <button
                                    onClick={() => navigate(`/baby/${selectedBabyId}/reports`)}
                                    className="ar-btn ar-btn-secondary"
                                    disabled={!selectedBabyId} 
                                >
                                    <FontAwesomeIcon icon={faCalendar} /> View All
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMoon, faUtensils, faBabyCarriage, faDroplet, faPills, faSchool } from '@fortawesome/free-solid-svg-icons';
import { Context } from "../store/appContext";
import "../../styles/view_all_reports.css";

export const ViewReports = () => {
    const { babyId } = useParams();
    const [reports, setReports] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [babyName, setBabyName] = useState("");
    const [editReport, setEditReport] = useState(null);
    const { store } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.token) {
            navigate('/login');
            return;
        }

        const fetchReportsAndBabyName = async () => {
            const reportsUrl = `${process.env.BACKEND_URL}api/baby/${babyId}/reports`;
            const babyUrl = `${process.env.BACKEND_URL}api/babies`;

            try {
                // Fetch baby information
                const babyResponse = await fetch(babyUrl, {
                    headers: { 'Authorization': `Bearer ${store.token}` }
                });
                if (!babyResponse.ok) {
                    throw new Error(`Error fetching babies: ${await babyResponse.text()}`);
                }

                const babies = await babyResponse.json();
                const baby = babies.find(b => b.id === parseInt(babyId));
                if (baby) {
                    setBabyName(baby.name);
                } else {
                    throw new Error("Baby not found");
                }

                // Fetch reports
                const reportsResponse = await fetch(reportsUrl, {
                    headers: { 'Authorization': `Bearer ${store.token}` }
                });
                if (!reportsResponse.ok) {
                    throw new Error(`Error ${reportsResponse.status}: ${await reportsResponse.text()}`);
                }

                const result = await reportsResponse.json();
                result.sort((a, b) => new Date(b.date) - new Date(a.date));
                setReports(result);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReportsAndBabyName();
    }, [babyId, store.token, navigate]);

    const handleEditClick = (report) => {
        setEditReport({ ...report });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditReport(prevReport => ({
            ...prevReport,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `${process.env.BACKEND_URL}api/baby/${babyId}/report/${editReport.id}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${store.token}`
                },
                body: JSON.stringify(editReport),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${await response.text()}`);
            }

            setReports(prevReports =>
                prevReports.map(report => report.id === editReport.id ? editReport : report)
            );
            setEditReport(null);

            alert("Report edited successfully!");

        } catch (error) {
            setError(error.message);
        }
    };

    const handleCancelEdit = () => {
        setEditReport(null);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="vr-container">
            <h2 className="vr-title">{babyName || "Loading..."}'s Reports</h2>
            {error && <div className="error">{error}</div>}
            {reports.length > 0 ? (
                <div className="vr-reports-container">
                    {reports.map(report => (
                        <div className="card vr-card" key={report.id}>
                            <form className="view-report__form" onSubmit={handleSubmit}>
                                <div className="edit-report__form-group">
                                    <label><FontAwesomeIcon icon={faCalendar} /></label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={editReport && editReport.id === report.id ? editReport.date.substring(0, 10) : report.date.substring(0, 10)}
                                        onChange={handleChange}
                                        disabled={editReport && editReport.id !== report.id}
                                        required
                                    />
                                </div>
                                <div className="edit-report__form-group">
                                    <label><FontAwesomeIcon icon={faMoon} /></label>
                                    <input
                                        type="number"
                                        name="bedtime"
                                        value={editReport && editReport.id === report.id ? editReport.bedtime : report.bedtime}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.1"
                                        disabled={editReport && editReport.id !== report.id}
                                        required
                                    />
                                </div>
                                <div className="edit-report__form-group">
                                    <label><FontAwesomeIcon icon={faUtensils} /></label>
                                    <input
                                        type="number"
                                        name="meals"
                                        value={editReport && editReport.id === report.id ? editReport.meals : report.meals}
                                        onChange={handleChange}
                                        min="0"
                                        disabled={editReport && editReport.id !== report.id}
                                        required
                                    />
                                </div>
                                <div className="edit-report__form-group">
                                    <label><svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 600"
                                        fill="currentColor"
                                        style={{ width: '37px', height: '37px' }}
                                    >
                                        <path d="M106.667,341.333c-15.04,0-29.611,4.117-43.307,12.267l-21.717,14.357c24.107,56,68.117,100.928,123.051,124.907l14.869-22.443C187.691,457.152,192,442.219,192,426.667C192,379.605,153.728,341.333,106.667,341.333z" />
                                        <path d="M426.667,234.667c0-11.776,9.536-21.333,21.333-21.333h42.667c-0.064-35.307-28.779-64-64.107-64H85.44c-35.328,0-64.043,28.693-64.107,64H64c11.797,0,21.333,9.557,21.333,21.333S75.797,256,64,256H21.333v14.037c0,19.221,2.432,37.888,6.571,55.872l12.8-8.448c20.949-12.48,43.456-18.795,65.963-18.795c70.592,0,128,57.408,128,128c0,23.211-6.613,46.251-19.115,66.667l-8.725,13.163c10.965,2.389,22.101,4.267,33.6,5.013c5.291,0.341,10.539,0.491,15.765,0.491c16.704,0,33.109-1.899,49.088-5.291l-8.384-12.672c-12.928-21.013-19.563-44.096-19.563-67.371c0-70.592,57.408-128,128-128c23.253,0,46.315,6.635,66.731,19.157l13.696,6.997c3.221-15.531,4.907-31.445,4.907-47.488V256H448C436.203,256,426.667,246.443,426.667,234.667z" />
                                        <path d="M320,426.667c0,15.595,4.331,30.549,12.864,44.416l14.741,22.251c25.024-10.624,48.341-25.536,68.843-44.757c24.768-23.211,43.819-51.52,56.469-82.432l-21.76-11.136C389.461,317.397,320,364.032,320,426.667z" />
                                    </svg></label>
                                    <input
                                        type="number"
                                        name="diapers"
                                        value={editReport && editReport.id === report.id ? editReport.diapers : report.diapers}
                                        onChange={handleChange}
                                        min="0"
                                        disabled={editReport && editReport.id !== report.id}
                                        required
                                    />
                                </div>
                                <div className="edit-report__form-group">
                                    <label><FontAwesomeIcon icon={faBabyCarriage} /></label>
                                    <input
                                        type="number"
                                        name="walks"
                                        value={editReport && editReport.id === report.id ? editReport.walks : report.walks}
                                        onChange={handleChange}
                                        min="0"
                                        disabled={editReport && editReport.id !== report.id}
                                        required
                                    />
                                </div>
                                <div className="edit-report__form-group">
                                    <label><FontAwesomeIcon icon={faDroplet} /></label>
                                    <input
                                        type="number"
                                        name="water"
                                        value={editReport && editReport.id === report.id ? editReport.water : report.water}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.1"
                                        disabled={editReport && editReport.id !== report.id}
                                        required
                                    />
                                </div>
                                <div className="edit-report-row">
                                <div className="edit-report__form-group">
                                    <label><FontAwesomeIcon icon={faPills} /></label>
                                    <label className="switch switch-edit">
                                        <input
                                            type="checkbox"
                                            name="meds"
                                            checked={editReport && editReport.id === report.id ? editReport.meds : report.meds}
                                            onChange={handleChange}
                                            disabled={editReport && editReport.id !== report.id}
                                        />
                                        <span className="slider round slider-edit"></span>
                                    </label>
                                </div>
                                <div className="edit-report__form-group">
                                    <label><FontAwesomeIcon icon={faSchool} /></label>
                                    <label className="switch switch-edit">
                                        <input
                                            type="checkbox"
                                            name="kindergarden"
                                            checked={editReport && editReport.id === report.id ? editReport.kindergarden : report.kindergarden}
                                            onChange={handleChange}
                                            disabled={editReport && editReport.id !== report.id}
                                        />
                                        <span className="slider round slider-edit"></span>
                                    </label>
                                </div>
                                </div>
                                <div className="edit-report-textarea__form-group" style={{ width: "100%" }}>
                                    <label>Notes:</label>
                                    <textarea
                                        name="extra"
                                        value={editReport && editReport.id === report.id ? editReport.extra : report.extra}
                                        onChange={handleChange}
                                        disabled={editReport && editReport.id !== report.id}
                                    />
                                </div>
                                {editReport && editReport.id === report.id ? (
                                    <div className="edit-report-buttons">
                                        <button type="submit" className="edit-report__btn">Save</button>
                                        <button type="button" className="edit-report__btn" onClick={handleCancelEdit}>Cancel</button>
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => handleEditClick(report)} className="edit-report__btn">Edit</button>
                                )}
                            </form>
                            <div className="divider"></div>
                        </div>
                        
                    ))}
                </div>
            ) : (
                <p>No reports found</p>
            )}
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary mt-3 blog-detail-btn">➜</button>
        </div>
    );
};

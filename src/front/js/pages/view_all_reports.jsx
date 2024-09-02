import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMoon, faUtensils, faBabyCarriage, faDroplet, faPills, faSchool } from '@fortawesome/free-solid-svg-icons';
import { Context } from "../store/appContext";
import "../../styles/view_all_reports.css";
import "../../styles/edit_report.css";

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
                                <div className="edit-report__form-row">
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
                                </div>
                                <div className="edit-report__form-row">
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
                                        <label><FontAwesomeIcon icon={faDroplet} /></label>
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
                                </div>
                                <div className="edit-report__form-row">
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
                                </div>
                                <div className="edit-report__form-row">
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
                                <div className="edit-report-textarea__form-row">
                                    <div className="edit-report-textarea__form-group" style={{ width: "100%" }}>
                                        <label>Notes:</label>
                                        <textarea
                                            name="extra"
                                            value={editReport && editReport.id === report.id ? editReport.extra : report.extra}
                                            onChange={handleChange}
                                            disabled={editReport && editReport.id !== report.id}
                                        />
                                    </div>
                                </div>
                                {editReport && editReport.id === report.id ? (
                                    <div className="edit-report-buttons">
                                        <button type="submit" className="edit-report__btn">Save Changes</button>
                                        <button type="button" className="edit-report__btn" onClick={handleCancelEdit}>Cancel</button>
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => handleEditClick(report)} className="edit-report__btn">Edit Report</button>
                                )}
                            </form>
                            
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

import React, { useState, useEffect, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPlus, faChartBar, faMoon, faUtensils, faBabyCarriage, faDroplet, faPills, faSchool, faBaby } from '@fortawesome/free-solid-svg-icons';
import "../../styles/avg_report.css";

export const AverageReportPage = () => {
    const { babyId } = useParams();
    const { store, actions } = useContext(Context);
    const [interval, setInterval] = useState("weekly");
    const [averages, setAverages] = useState(null);
    const [extremes, setExtremes] = useState({ max: null, min: null });
    const [babyName, setBabyName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const headers = {
                    'Authorization': `Bearer ${store.token}`,
                    'Content-Type': 'application/json'
                };

                const averagesData = await actions.fetchAverages(babyId, interval, headers);
                const extremesData = await actions.fetchExtremes(babyId, interval, headers);
                setAverages(averagesData);
                setExtremes(extremesData);

                const babyResponse = await fetch(`${process.env.BACKEND_URL}api/babies`, { headers });
                if (!babyResponse.ok) {
                    console.error('Error fetching babies:', await babyResponse.text());
                    return;
                }
                const babies = await babyResponse.json();
                const baby = babies.find(b => b.id === parseInt(babyId));
                if (baby) {
                    setBabyName(baby.name);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [babyId, interval, actions, store.token, navigate]);

    // Función para generar opciones del gráfico radial para una variable específica
    const generateChartOptions = (label, avg, max) => ({
        series: [Math.min((avg / max) * 100, 100)],
        options: {
            chart: {
                height: 350,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 225,
                    hollow: {
                        margin: 0,
                        size: '70%',
                        background: '#fff',
                    },
                    track: {
                        background: '#fff',
                        strokeWidth: '67%',
                        dropShadow: {
                            enabled: true,
                            top: -3,
                            left: 0,
                            blur: 4,
                            opacity: 0.35
                        }
                    },
                    dataLabels: {
                        show: true,
                        name: {
                            offsetY: -10,
                            color: '#888',
                            fontSize: '17px'
                        },
                        value: {
                            formatter: function (val) {
                                return avg.toFixed(2); // Muestra el valor promedio
                            },
                            color: '#111',
                            fontSize: '36px',
                            show: true,
                        }
                    }
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'horizontal',
                    shadeIntensity: 0.5,
                    gradientToColors: ['#ABE5A1'],
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100]
                }
            },
            stroke: {
                lineCap: 'round'
            },
            labels: [label],
        }
    });

    return (
        <div className="avg-container">
            <div className="avg-row">
                <div className="avg-content">
                    <div className="avg-header">
                        <h2>{babyName ? `${babyName}'s Report` : 'Report'}</h2>
                        <div className="avg-controls">
                            <label>Select Interval:</label>
                            <select className="custom-select" value={interval} onChange={(e) => setInterval(e.target.value)}>
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Biweekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    </div>

                    {averages && extremes.max && extremes.min ? (
                        <div className="avg-chart-general-container">
                            <div className="avg-chart-container">
                                <div className="avg-chart-ind">
                                    <ReactApexChart
                                        options={{
                                            chart: {
                                                height: 600,
                                                type: 'radialBar',
                                            },
                                            plotOptions: {
                                                radialBar: {
                                                    startAngle: 0,
                                                    endAngle: 365,
                                                    hollow: {
                                                        margin: 0,
                                                        size: '50%',
                                                        background: '#fff',
                                                    },
                                                    track: {
                                                        background: '#fff',
                                                        strokeWidth: '120%',

                                                    },
                                                    dataLabels: {
                                                        show: true,
                                                        name: {
                                                            color: '#888',
                                                            fontSize: '1px',
                                                            formatter: function () {
                                                                return ' '
                                                            },
                                                        },
                                                        value: {
                                                            formatter: function (val) {
                                                                return `${averages.bedtime.toFixed(2)}`; // Muestra el promedio y la unidad que desees
                                                            },
                                                            color: '#075E81',
                                                            fontFamily: 'Poppins, sans-serif',
                                                            fontWeight: '600',
                                                            fontSize: '29px',
                                                            show: true,
                                                            offsetY: -5,
                                                        }
                                                    }
                                                }
                                            },
                                            fill: {
                                                type: 'solid',
                                                colors: ['#B4E49D']
                                            },
                                            stroke: {
                                                lineCap: 'round',
                                            },
                                        }}
                                        series={[Math.min((averages.bedtime / extremes.max.bedtime) * 100, 100)]}
                                        type="radialBar"
                                        height={350}
                                    />
                                </div>
                                <h3><FontAwesomeIcon icon={faMoon} /></h3>
                            </div>
                            <div className="avg-chart-container">
                                <div className="avg-chart-ind">
                                    <ReactApexChart
                                        options={{
                                            chart: {
                                                height: 600,
                                                type: 'radialBar',
                                            },
                                            plotOptions: {
                                                radialBar: {
                                                    startAngle: 0,
                                                    endAngle: 365,
                                                    hollow: {
                                                        margin: 0,
                                                        size: '50%',
                                                        background: '#fff',
                                                    },
                                                    track: {
                                                        background: '#fff',
                                                        strokeWidth: '120%',

                                                    },
                                                    dataLabels: {
                                                        show: true,
                                                        name: {
                                                            color: '#888',
                                                            fontSize: '1px',
                                                            formatter: function () {
                                                                return ' '
                                                            },
                                                        },
                                                        value: {
                                                            formatter: function (val) {
                                                                return `${averages.meals.toFixed(2)}`; // Muestra el promedio y la unidad que desees
                                                            },
                                                            color: '#075E81',
                                                            fontFamily: 'Poppins, sans-serif',
                                                            fontWeight: '600',
                                                            fontSize: '29px',
                                                            show: true,
                                                            offsetY: -5,
                                                        }
                                                    }
                                                }
                                            },
                                            fill: {
                                                type: 'solid',
                                                colors: ['#B4E49D']
                                            },
                                            stroke: {
                                                lineCap: 'round',
                                            },
                                        }}
                                        series={[Math.min((averages.meals / extremes.max.meals) * 100, 100)]}
                                        type="radialBar"
                                        height={350}
                                    />
                                </div>
                                <h3><FontAwesomeIcon icon={faUtensils} /></h3>
                            </div>
                            <div className="avg-chart-container">
                                <div className="avg-chart-ind">
                                    <ReactApexChart
                                        options={{
                                            chart: {
                                                height: 600,
                                                type: 'radialBar',
                                            },
                                            plotOptions: {
                                                radialBar: {
                                                    startAngle: 0,
                                                    endAngle: 365,
                                                    hollow: {
                                                        margin: 0,
                                                        size: '50%',
                                                        background: '#fff',
                                                    },
                                                    track: {
                                                        background: '#fff',
                                                        strokeWidth: '120%',

                                                    },
                                                    dataLabels: {
                                                        show: true,
                                                        name: {
                                                            color: '#888',
                                                            fontSize: '1px',
                                                            formatter: function () {
                                                                return ' '
                                                            },
                                                        },
                                                        value: {
                                                            formatter: function (val) {
                                                                return `${averages.diapers.toFixed(2)}`; // Muestra el promedio y la unidad que desees
                                                            },
                                                            color: '#075E81',
                                                            fontFamily: 'Poppins, sans-serif',
                                                            fontWeight: '600',
                                                            fontSize: '29px',
                                                            show: true,
                                                            offsetY: -5,
                                                        }
                                                    }
                                                }
                                            },
                                            fill: {
                                                type: 'solid',
                                                colors: ['#B4E49D']
                                            },
                                            stroke: {
                                                lineCap: 'round',
                                            },
                                        }}
                                        series={[Math.min((averages.diapers / extremes.max.diapers) * 100, 100)]}
                                        type="radialBar"
                                        height={350}
                                    />
                                </div>
                                <h3>
                                    Diapers
                                </h3>
                            </div>
                            <div className="avg-chart-container">
                                <div className="avg-chart-ind">
                                    <ReactApexChart
                                        options={{
                                            chart: {
                                                height: 600,
                                                type: 'radialBar',
                                            },
                                            plotOptions: {
                                                radialBar: {
                                                    startAngle: 0,
                                                    endAngle: 365,
                                                    hollow: {
                                                        margin: 0,
                                                        size: '50%',
                                                        background: '#fff',
                                                    },
                                                    track: {
                                                        background: '#fff',
                                                        strokeWidth: '120%',

                                                    },
                                                    dataLabels: {
                                                        show: true,
                                                        name: {
                                                            color: '#888',
                                                            fontSize: '1px',
                                                            formatter: function () {
                                                                return ' '
                                                            },
                                                        },
                                                        value: {
                                                            formatter: function (val) {
                                                                return `${averages.walks.toFixed(2)}`; // Muestra el promedio y la unidad que desees
                                                            },
                                                            color: '#075E81',
                                                            fontFamily: 'Poppins, sans-serif',
                                                            fontWeight: '600',
                                                            fontSize: '29px',
                                                            show: true,
                                                            offsetY: -5,
                                                        }
                                                    }
                                                }
                                            },
                                            fill: {
                                                type: 'solid',
                                                colors: ['#B4E49D']
                                            },
                                            stroke: {
                                                lineCap: 'round',
                                            },
                                        }}
                                        series={[Math.min((averages.walks / extremes.max.walks) * 100, 100)]}
                                        type="radialBar"
                                        height={350}
                                    />
                                </div>
                                <h3><FontAwesomeIcon icon={faBabyCarriage} /></h3>
                            </div>
                            <div className="avg-chart-container">
                                <div className="avg-chart-ind">
                                    <ReactApexChart
                                        options={{
                                            chart: {
                                                height: 600,
                                                type: 'radialBar',
                                            },
                                            plotOptions: {
                                                radialBar: {
                                                    startAngle: 0,
                                                    endAngle: 365,
                                                    hollow: {
                                                        margin: 0,
                                                        size: '50%',
                                                        background: '#fff',
                                                    },
                                                    track: {
                                                        background: '#fff',
                                                        strokeWidth: '120%',

                                                    },
                                                    dataLabels: {
                                                        show: true,
                                                        name: {
                                                            color: '#888',
                                                            fontSize: '1px',
                                                            formatter: function () {
                                                                return ' '
                                                            },
                                                        },
                                                        value: {
                                                            formatter: function (val) {
                                                                return `${averages.water.toFixed(2)}`; // Muestra el promedio y la unidad que desees
                                                            },
                                                            color: '#075E81',
                                                            fontFamily: 'Poppins, sans-serif',
                                                            fontWeight: '600',
                                                            fontSize: '29px',
                                                            show: true,
                                                            offsetY: -5,
                                                        }
                                                    }
                                                }
                                            },
                                            fill: {
                                                type: 'solid',
                                                colors: ['#B4E49D']
                                            },
                                            stroke: {
                                                lineCap: 'round',
                                            },
                                        }}
                                        series={[Math.min((averages.water / extremes.max.water) * 100, 100)]}
                                        type="radialBar"
                                        height={350}
                                    />
                                </div>
                                <h3><FontAwesomeIcon icon={faDroplet} /></h3>
                            </div>
                        </div>
                    ) : (
                        <p>No data available for the selected interval.</p>
                    )}

                    <button onClick={() => navigate('/dashboard')} className="btn btn-secondary mt-3 blog-detail-btn">➜</button>
                </div>
            </div>
        </div>
    );
};

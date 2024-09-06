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
                setAverages(null);  
                setExtremes({ max: null, min: null });
        
                const headers = {
                    'Authorization': `Bearer ${store.token}`,
                    'Content-Type': 'application/json'
                };
        
                const averagesData = await actions.fetchAverages(babyId, interval, headers);
                const extremesData = await actions.fetchExtremes(babyId, interval, headers);
        
                setAverages(averagesData);
                setExtremes(extremesData);
        
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
                                return avg.toFixed(2); 
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
                                                                return ' ';  
                                                            },
                                                        },
                                                        value: {
                                                            formatter: function (val) {
                                                                let label;
                                                                switch (interval) {
                                                                    case 'weekly':
                                                                        label = `${averages.bedtime.toFixed(2)}`;
                                                                        break;
                                                                    case 'biweekly':
                                                                        label = `${averages.bedtime.toFixed(2)}`;
                                                                        break;
                                                                    case 'monthly':
                                                                        label = `${averages.bedtime.toFixed(2)}`;
                                                                        break;
                                                                    default:
                                                                        label = `${averages.bedtime.toFixed(2)}`;
                                                                }
                                                                return label;
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

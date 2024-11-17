// src/pages/CarPage.jsx
import React, { useEffect, useState } from 'react';
import './CarPage.css';

const CarPage = () => {
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [yearData, setYearData] = useState([]);

    useEffect(() => {
        const loadManufacturers = async () => {
            const response = await fetch('/src/data');
            const dirList = await response.json(); // Assuming the backend serves a directory listing
            setManufacturers(dirList);
        };

        loadManufacturers();
    }, []);

    const loadModels = async (manufacturer) => {
        const response = await fetch(`/src/data/${manufacturer}`);
        const modelList = await response.json();
        setModels(modelList);
        setSelectedManufacturer(manufacturer);
        setSelectedModel(null);
        setYearData([]);
    };

    const loadYearData = async (manufacturer, model) => {
        const response = await fetch(`/src/data/${manufacturer}/${model}`);
        const yearFiles = await response.json();

        const allYearData = [];
        for (const yearFile of yearFiles) {
            const yearResponse = await fetch(`/src/data/${manufacturer}/${model}/${yearFile}`);
            const yearText = await yearResponse.text();
            const [city, highway, combination] = yearText.split(',');
            allYearData.push({
                year: yearFile.replace('.txt', ''),
                city,
                highway,
                combination,
            });
        }

        setYearData(allYearData);
        setSelectedModel(model);
    };

    return (
        <div className="car-page">
            {/* Sidebar */}
            <div className="sidebar">
                <h2 className="sidebar-title">Manufacturers</h2>
                <ul className="manufacturer-list">
                    {manufacturers.map((manufacturer, index) => (
                        <li
                            key={index}
                            className={
                                manufacturer === selectedManufacturer ? 'selected' : ''
                            }
                            onClick={() => loadModels(manufacturer)}
                        >
                            {manufacturer}
                        </li>
                    ))}
                </ul>

                {models.length > 0 && (
                    <div>
                        <h3>Models</h3>
                        <ul className="model-list">
                            {models.map((model, index) => (
                                <li
                                    key={index}
                                    className={model === selectedModel ? 'selected' : ''}
                                    onClick={() => loadYearData(selectedManufacturer, model)}
                                >
                                    {model}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="main-content">
                <h1>{selectedModel ? `${selectedModel} (${selectedManufacturer})` : 'Select a Car'}</h1>
                {yearData.length > 0 ? (
                    <table className="car-table">
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>City MPG</th>
                                <th>Highway MPG</th>
                                <th>Combination MPG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {yearData.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.year}</td>
                                    <td>{data.city}</td>
                                    <td>{data.highway}</td>
                                    <td>{data.combination}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No data available. Select a manufacturer and model.</p>
                )}
            </div>
        </div>
    );
};

export default CarPage;

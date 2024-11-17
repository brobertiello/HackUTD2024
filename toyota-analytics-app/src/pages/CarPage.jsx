import React, { useEffect, useState } from 'react';
import './CarPage.css';

const CarPage = () => {
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [yearData, setYearData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [carDetails, setCarDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadManufacturers = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/data/'); // Assuming the data folder is served under the /data path
                if (!response.ok) throw new Error('Failed to load manufacturers.');
                const manufacturers = await response.json();
                setManufacturers(manufacturers);
            } catch (error) {
                console.error('Error loading manufacturers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadManufacturers();
    }, []);

    const loadModels = async (manufacturer) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/data/${manufacturer}/`);
            if (!response.ok) throw new Error(`Failed to load models for ${manufacturer}.`);
            const models = await response.json();
            setModels(models);
            setSelectedManufacturer(manufacturer);
            setSelectedModel(null);
            setYearData([]);
            setCarDetails(null);
        } catch (error) {
            console.error('Error loading models:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadYearData = async (manufacturer, model) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/data/${manufacturer}/${model}/`);
            if (!response.ok) throw new Error(`Failed to load years for ${model}.`);
            const years = await response.json();
            setYearData(years);
            setSelectedModel(model);
            setCarDetails(null);
        } catch (error) {
            console.error('Error loading year data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCarDetails = async (manufacturer, model, year) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/data/${manufacturer}/${model}/${year}.txt`);
            if (!response.ok) throw new Error(`Failed to load details for ${model} (${year}).`);
            const yearText = await response.text();
            const [city, highway, combination] = yearText.split(',');

            setCarDetails({
                year,
                city: city.trim(),
                highway: highway.trim(),
                combination: combination.trim(),
            });
            setSelectedYear(year);
        } catch (error) {
            console.error('Error loading car details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="car-page">
            {isLoading && <div className="loading">Loading...</div>}

            {/* Sidebar */}
            {!isLoading && (
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

                    {yearData.length > 0 && (
                        <div>
                            <h3>Years</h3>
                            <ul className="year-list">
                                {yearData.map((year, index) => (
                                    <li
                                        key={index}
                                        className={year === selectedYear ? 'selected' : ''}
                                        onClick={() => loadCarDetails(selectedManufacturer, selectedModel, year)}
                                    >
                                        {year}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Main Content */}
            <div className="main-content">
                <h1>{selectedModel ? `${selectedModel} (${selectedManufacturer})` : 'Select a Car'}</h1>
                {carDetails ? (
                    <div className="car-details">
                        <h2>{`Year: ${carDetails.year}`}</h2>
                        <p>{`City MPG: ${carDetails.city}`}</p>
                        <p>{`Highway MPG: ${carDetails.highway}`}</p>
                        <p>{`Combination MPG: ${carDetails.combination}`}</p>
                    </div>
                ) : (
                    <p>Select a manufacturer, model, and year to view details.</p>
                )}
            </div>
        </div>
    );
};

export default CarPage;

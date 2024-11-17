import React from 'react';
import CarCard from './CarCard';

const CarCards = ({ cars }) => {
    return (
        <div style={styles.cardContainer}>
            {cars.map((car, index) => (
                <CarCard key={index} name={car.label} />
            ))}
        </div>
    );
};

const styles = {
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
        gap: '16px',
    },
};

export default CarCards;

import React from 'react';

const CarCard = ({ name }) => {
    return (
        <div style={styles.card}>
            <h3 style={styles.cardTitle}>{name}</h3>
        </div>
    );
};

const styles = {
    card: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        width: '200px',
    },
    cardTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        margin: 0,
    },
};

export default CarCard;

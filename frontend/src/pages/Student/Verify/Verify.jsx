import React, { useContext, useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../../context/StoreContext';
import axios from 'axios';

function Verify() {
    const [searchParams] = useSearchParams();
    const success = searchParams.get('success');
    const reservationId = searchParams.get('reservationId');  // Ensure PayMongo sends the correct userId
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();

    console.log('Verifying payment:', { success, reservationId });

    const verifyPayment = async () => {
        try {
            const response = await axios.post(`${url}/api/reservation/verify`, { success, reservationId });
            if (response.data.success) {
                navigate('/myReservations'); // Redirect to reservations if successful
            } else {
                navigate('/'); // Redirect to a failure page
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            navigate('/');
        }
    };

    useEffect(() => {
        verifyPayment();
    }, []); // Ensure useEffect runs only once

    return (
        <div className="verify">
            <div className="spinner"></div>
        </div>
    );
}

export default Verify;

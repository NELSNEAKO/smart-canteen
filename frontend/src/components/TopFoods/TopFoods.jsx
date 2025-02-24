import React, { useState, useEffect, useContext } from 'react'; // ✅ Added useContext
import axios from 'axios';
import './TopFoods.css';
import { StoreContext } from '../../context/StoreContext';

const TopFoods = () => {
    const [list, setList] = useState([]);
    const { url } = useContext(StoreContext); // ✅ Now useContext works

    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/top`);
            if (response.data.success) {
                setList(response.data.data);
                console.log(response.data.data);
            } 
        } catch (error) {
            console.error("Error fetching list:", error);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

return (
        <>        
        
        </>
    );
};

export default TopFoods;

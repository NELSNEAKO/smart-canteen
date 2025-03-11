import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Make sure you install react-toastify
import './Vendor.css';

const Vendor = ({ url }) => {
    const [vendor, setVendor] = useState([]);

    const fetchVendor = async () => {
        try {
            const response = await axios.get(`${url}/api/vendor/vendors`);
            if (response.data.success) {
                setVendor(response.data.vendor);
                console.log(response.data.vendor);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch vendors.");
        }
    };

    const deleteVendor = async (vendorId) => {
        try {
            const response = await axios.delete(`${url}/api/vendor/delete/${vendorId}`);
            if (response.data.success) {
                toast.success(response.data.message);
                fetchVendor(); // Refresh the vendor list after deletion
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to delete vendor.");
        }
    };

    useEffect(() => {
        fetchVendor();
    }, []);

    return (
        <div className='vendors'>
            <p>All Vendors</p>
            <div className="vendor-table">
                <div className='vendor-table-format title'>
                    <b>Name</b>
                    <b>Email</b>
                    {/* <b className='action-title'>Action</b> */}
                </div>
                {vendor.map((item, index) => (
                    <div className="vendor-table-format" key={index}>
                        <p>{item.name}</p>
                        <p>{item.email}</p>
                        {/* <p onClick={() => deleteVendor(item._id)} className="cursor action">X</p> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Vendor;

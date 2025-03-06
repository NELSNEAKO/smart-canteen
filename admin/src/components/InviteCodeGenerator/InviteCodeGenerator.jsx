import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InviteCodeGenerator.css";

const InviteCodeGenerator = ({url}) => {
    const [inviteList, setInviteList] = useState([]);

    // Fetch stored invite codes from the database
    const fetchInviteCodes = async () => {
        try {
            const response = await axios.get(`${url}/api/vendor/get-invite`);
            setInviteList(response.data.data);
            // console.log("Invite codes:", response.data.data);
            
        } catch (error) {
            console.error("Error fetching invite codes:", error);
        }
    };

    // Generate new invite code and add it to the database
    const generateCode = async () => {
        try {
            const response = await axios.post(`${url}/api/vendor/invite`);
            const newCode = response.data; // Assuming it returns { inviteCode }

            // Add new code to the list without refetching
            setInviteList((prevList) => [
                ...prevList,
                { code: newCode.inviteCode, status: "unused" } // Update status to "unused"
            ]);
        } catch (error) {
            console.error("Error generating invite code:", error);
        }
    };

    useEffect(() => {
        fetchInviteCodes();
    }, []);

    return (
        <div className="invite-container">
            <button onClick={generateCode}>Generate Code</button>
            <h2>🔑 Vendor Invite Code</h2>
            <div className="invite-table">
                <div className="invite-table-format title">
                    <b>Invite Code</b>
                    <b>Status</b>
                </div>
            </div>

            {inviteList
                .filter(code => code.status === "unused") // Only show codes with "unused" status
                .map((code, index) => (
                    <div key={index} className="invite-table">
                        <div className="invite-table-format">
                            <p>{code.code}</p>
                            <p>{code.status === "unused" ? "Available" : code.status}</p>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default InviteCodeGenerator;

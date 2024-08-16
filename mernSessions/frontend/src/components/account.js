import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router";

export default function Account() {

    const [account, setAccount] = useState({
        first: "",
        last: "",
        email: "",
        phone: "",
        role: "",
        savings: 0,
        checking: 0,
    });

    const navigate = useNavigate();

    useEffect(() => {
        async function getAccount() {
            const response = await fetch("http://localhost:4000/record", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include"
            }).catch(error => {
                window.alert(error);
                return;
            });
                console.log(response.status);
                if(!response.ok) {
                    navigate("/login");
                }
                else {
                    const tempVar = await response.json();
                    setAccount(tempVar);
                }
        }
        getAccount();
        return;
    },[navigate]);

    return (
        <div>
            <h3>Account Summary</h3>
            <p>First Name: {account.first}</p>
            <p>Last Name: {account.last}</p>
            <p>Email: {account.email}</p>
            <p>Phone: {account.phone}</p>
        </div>
    )
}
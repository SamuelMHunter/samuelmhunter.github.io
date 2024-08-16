import React, {useEffect} from "react";
import {useNavigate} from "react-router";

export default function Logout() {

    const navigate = useNavigate();

    useEffect(() => {
        async function logOut() {
            const response = await fetch("http://localhost:4000/record/logout",
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if(!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
            }
            else {
                //navigate("/login");
            }
        }
        logOut();
        return;

    }, [navigate])


    return (
        <div>
            <h3>You have been logged out.</h3>
        </div>
    )
}
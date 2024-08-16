import React, {useState} from "react";
import {useNavigate} from "react-router";

export default function Login() {

    const[form, setForm] = useState({
        email: "",
        password: "",
    });
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    function updateForm(jsonObj) {
        return setForm((prevJsonObj) => {
            return {...prevJsonObj, ...jsonObj};
        });
    }

    async function onSubmit(e) {
        e.preventDefault();
        const loginInfo = {...form};
        let response = await fetch("http://localhost:4000/record/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(loginInfo),
        }).catch(error => {
            console.log("you don't want to be here.");
            console.log(error);
            window.alert(error);
            return;
        });
        setForm({email: "", password: ""});
        if(response.status === 403) {
            setErrorMsg("Incorrect password used, or account doesn't exist."); //error messages broke at some point remember to fix
            console.log("errormsg should have been displayed for user.");
        }
        else {
            console.log("User input was correct and no errormsg should be shown.");
            setErrorMsg("");
            navigate(`/myaccount`);
        }
        console.log(response.status);
    }

    return (
        <div>
            <h3>Please enter email and password</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Email: </label>
                    <input
                    type="text"
                    id="email"
                    value={form.email}
                    onChange={(e) => updateForm({email: e.target.value})}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                    type="text"
                    id="password"
                    value={form.password}
                    onChange={(e) => updateForm({password: e.target.value})}
                    />
                </div>
                <br/>
                <div>
                    <input
                    type="submit"
                    value="Login"
                    />
                </div>
            </form>
            <p>{errorMsg}</p>
        </div>
    )
}
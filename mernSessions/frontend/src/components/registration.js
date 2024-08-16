import React, {useState} from "react";
import {useNavigate} from "react-router";

export default function Registration() {
    const [form, setForm] = useState({
        first: "",
        last: "",
        email: "",
        phone: "",
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
        const newPerson = {...form};
        let response = await fetch("http://localhost:4000/record/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(newPerson),
        }).catch(error => {
            console.log("you don't want to be here.");
            console.log(error);
            window.alert(error);
            return;
        });
        setForm({first: "", last: "", email: "", phone: "", password: ""});
        if(response.status === 403) {
            setErrorMsg("An account with the provided email address already exists."); //error messages broke at some point remember to fix
            console.log("You got here because the email already exists. Should display errormsg");
        }
        else {
            console.log("You got here because userinput was correct, no error msg should be shown");
            setErrorMsg("");
            navigate(`/myaccount`);
        }
    }

    return (
        <div>
            <h3>Register New Account</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label>First Name: </label>
                    <input
                    type="text"
                    id="first"
                    value={form.first}
                    onChange={(e) => updateForm({first: e.target.value})}
                    />
                </div>
                <div>
                    <label>Last Name: </label>
                    <input
                    type="text"
                    id="last"
                    value={form.last}
                    onChange={(e) => updateForm({last: e.target.value})}
                    />
                </div>
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
                    <label>Phone Number: </label>
                    <input
                    type="text"
                    id="phone"
                    value={form.phone}
                    onChange={(e) => updateForm({phone: e.target.value})}
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
                    value="Register"
                    />
                </div>
            </form>
            <p>{errorMsg}</p>
        </div>
    )
}
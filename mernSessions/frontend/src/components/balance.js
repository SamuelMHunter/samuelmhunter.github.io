import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router";

export default function Balance() {
    
    const [form, setForm] = useState({
        checking: 0,
        savings: 0
    });

    const [form2, setForm2] = useState({
        checking: 0,
        savings: 0
    });

    const [form3, setForm3] = useState({
        checking: 0,
        savings: 0
    });

    const [balance, setBalance] = useState({
        checking: 0,
        savings: 0
    });

    const [errorMsg, setErrorMsg] = useState("");

    const [errorMsg2, setErrorMsg2] = useState("");

    const navigate = useNavigate();

    function updateForm(jsonObj) {
        return setForm((prevJsonObj) => {
            return {...prevJsonObj, ...jsonObj};
        });
    }

    function updateForm2(jsonObj) {
        return setForm2((prevJsonObj) => {
            return {...prevJsonObj, ...jsonObj};
        });
    }

    function updateForm3(jsonObj) {
        return setForm3((prevJsonObj) => {
            return {...prevJsonObj, ...jsonObj};
        });
    }

    async function deposit(e) {
        e.preventDefault();
        const depositVal = {...form};
        console.log(JSON.stringify(depositVal));
        await fetch("http://localhost:4000/deposit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(depositVal),
        }).catch(error => {
            console.log("you don't want to be here.");
            console.log(error);
            window.alert(error);
            return;
        });
        setForm({checking: "", savings: ""});
        navigate(`/myaccount`);
    }

    async function withdraw(e) {
        e.preventDefault();
        const withdrawVal = {...form2};
        const result = await fetch("http://localhost:4000/withdraw", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(withdrawVal),
        }).catch(error => {
            console.log("you don't want to be here.");
            console.log(error);
            window.alert(error);
            return;
        });
        setForm2({checking: "", savings: ""});
        if(result.status === 403) {
            setErrorMsg("You cannot withdraw more than your balance!");
        }
        else {
            setErrorMsg("");
            navigate(`/myaccount`);
        }
    }

    async function transfer(e) {
        e.preventDefault();
        const transferVal = {...form3};
        const result = await fetch("http://localhost:4000/transfer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(transferVal),
        }).catch(error => {
            console.log("you don't want to be here.");
            console.log(error);
            window.alert(error);
            return;
        });
        setForm3({checking: "", savings: ""});
        if(result.status === 403) {
            setErrorMsg2("You cannot transfer more than your balance!");
        }
        else {
            setErrorMsg2("");
            navigate(`/myaccount`);
        }
    }

    useEffect(() => {
        async function getBalance() {
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
                    setBalance(tempVar);
                }
        }
        getBalance();
        return;
    },[navigate]);

    return (
        <div>
            <div>
             <h3>Balance</h3>
                <p>Checking: {balance.checking}</p>
                <p>Savings: {balance.savings}</p>
            </div>
            <div>
                <h4>Deposit</h4>
                <form onSubmit={deposit}>
                <div>
                    <label>Checking: </label>
                    <input
                    type="text"
                    id="checking"
                    value={form.checking}
                    onChange={(e) => updateForm({checking: e.target.value})}
                    />
                </div>
                <div>
                    <label>Savings: </label>
                    <input
                    type="text"
                    id="savings"
                    value={form.savings}
                    onChange={(e) => updateForm({savings: e.target.value})}
                    />
                </div>
                <div>
                    <input
                    type="submit"
                    value="Deposit"
                    />
                </div>
                </form>
            </div>
            <div>
                <p>{errorMsg}</p>
                <h4>Withdraw</h4>
                <form onSubmit={withdraw}>
                <div>
                    <label>Checking: </label>
                    <input
                    type="text"
                    id="checking2"
                    value={form2.checking}
                    onChange={(e) => updateForm2({checking: e.target.value})}
                    />
                </div>
                <div>
                    <label>Savings: </label>
                    <input
                    type="text"
                    id="savings2"
                    value={form2.savings}
                    onChange={(e) => updateForm2({savings: e.target.value})}
                    />
                </div>
                <div>
                    <input
                    type="submit"
                    value="Withdraw"
                    />
                </div>
                </form>
            </div>
            <div>
                <p>{errorMsg2}</p>
                <h4>Transfer Into</h4>
                <form onSubmit={transfer}>
                <div>
                    <label>Checking: </label>
                    <input
                    type="text"
                    id="checking3"
                    value={form3.checking}
                    onChange={(e) => updateForm3({checking: e.target.value})}
                    />
                </div>
                <div>
                    <label>Savings: </label>
                    <input
                    type="text"
                    id="savings3"
                    value={form3.savings}
                    onChange={(e) => updateForm3({savings: e.target.value})}
                    />
                </div>
                <div>
                    <input
                    type="submit"
                    value="Transfer"
                    />
                </div>
                </form>
            </div>
        </div>
    )
}   
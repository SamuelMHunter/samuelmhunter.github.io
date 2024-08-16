import React from "react";
import {Route, Routes} from "react-router-dom";
import Registration from "./components/registration.js";
import Account from "./components/account.js";
import Logout from "./components/logout.js";
import Login from "./components/login.js";
import Balance from "./components/balance.js";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/myaccount" element={<Account />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/balance" element={<Balance />} />
      </Routes>
    </div>
  );
}

export default App;

import React, { Component, useEffect, useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import axiosInstance from "./axiosIntercepter";
import Main from "./Main";
import Register from "./Register";
import Test from "./Test";
const App = () => {
  const [user, setUser] = useState();
  useEffect(() => {
    console.log(axiosInstance.defaults.headers.common);
    axiosInstance
      .post("/user/token")
      .then((res) => {
        setUser(res.data.user.user);
      })
      .catch((e) => {
        if (e.response) {
          console.log(e.response.data);
        } else {
          console.log(e.message);
        }
      });
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main user={user} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/:id" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

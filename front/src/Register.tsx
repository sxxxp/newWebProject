import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axiosInstance from "./axiosIntercepter";
const Register = () => {
  const [cookie, setCookie, removeCookie] = useCookies();
  const [error, setError] = useState<string | undefined>("");
  const location = useLocation();
  const state = JSON.parse(location.state);
  const navigate = useNavigate();
  const [nickname, setNickname] = useState<string>("");
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!nickname) return;

    e.preventDefault();
    axiosInstance
      .put("/register", {
        nickname,
        uid: state["uid"],
        email: state["email"],
      })
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          navigate("/");
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data);

          setError(err.response.data.message);
        } else setError(err.message);
      });
  };
  return (
    <div className="App">
      {!state ? (
        <div>
          <h1>잘못된 요청입니다.</h1>
          <NavLink
            to="/"
            className="Link"
            style={({ isActive, isPending }) => {
              return {
                fontWeight: isActive ? "bold" : "",
                color: isPending ? "red" : "",
              };
            }}
          >
            돌아가기
          </NavLink>
        </div>
      ) : (
        <div>
          <h1>Register With Google</h1>
          <h2>{error && error}</h2>
          <form
            method="post"
            action="localhost:8000/register"
            onSubmit={onSubmit}
          >
            <input
              type="text"
              name="nickname"
              id="nickname"
              className="form-input"
              placeholder="닉네임"
              autoFocus
              autoComplete="off"
              required
              onChange={(e) => {
                setNickname(e.currentTarget.value);
              }}
              value={nickname}
            />
            <input type="submit" value="계정생성" className="btn-submit" />
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;

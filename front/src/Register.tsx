import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
const Register = () => {
  const [cookie, setCookie, removeCookie] = useCookies();
  const location = useLocation();
  const state = JSON.parse(location.state);
  console.log(state);
  const navigate = useNavigate();
  const [nickname, setNickname] = useState<string>("");
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!nickname) return;

    e.preventDefault();
    fetch("http://localhost:8000/register", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname,
        uid: state["uid"],
        email: state["email"],
      }),
    }).then((res) => {
      console.log(res);
      if (res.status === 201) {
        res.json().then((value) => {
          setCookie("access_token", value.access_token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 30,
            path: "/",
          });
          navigate("/");
        });
      }
    });
  };
  console.log(state);
  return (
    <div className="form-body">
      <h1>Register {state["displayName"]}</h1>
      <form method="post" action="localhost:8000/register" onSubmit={onSubmit}>
        <input
          type="text"
          name="nickname"
          id="nickname"
          className="form-input"
          placeholder="닉네임"
          required
          onChange={(e) => {
            setNickname(e.currentTarget.value);
          }}
          value={nickname}
        />
        <input type="submit" value="회원가입" className="btn-submit" />
      </form>
    </div>
  );
};

export default Register;

import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "./firebase";
import "./App.css";
import { useCookies } from "react-cookie";
interface IUser {
  email: string;
  role: number;
  uid: string;
  nickname: string;
  create_at: Date;
}
const Main = () => {
  const [cookie, setCookie, removeCookie] = useCookies(["access_token"]);
  const [user, setUser] = useState<IUser | null>();
  const [token, setToken] = useState<string | null>();
  const navigate = useNavigate();
  useEffect(() => {
    if (cookie.access_token) setToken(cookie.access_token);
    console.log(cookie);
  }, [cookie]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((data) => {
      if (!data) throw new Error("no data");
      fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.user.email,
          uid: data.user.uid,
        }),
      }).then((res) => {
        if (res.status === 204) {
          console.log(data.user);
          if (data.user) {
            navigate("/register", { state: JSON.stringify(data.user) });
          } else {
            return;
          }
        } else if (res.status === 200) {
          res.json().then((value) => {
            setUser(value.user);
            setCookie("access_token", value.access_token, {
              httpOnly: true,
              secure: true,
              maxAge: 1000 * 60 * 30,
              path: "/",
            });
          });
        }
      });
    });
  };
  return (
    <div className="App">
      <h2>집가고싶다.</h2>
      {!user ? (
        <button onClick={handleClick} className="btn-login">
          Login With Google <FontAwesomeIcon icon={faGoogle} />
        </button>
      ) : (
        ""
      )}
      <p>
        {user ? user.nickname : ""}
        {token ? token : ""}
      </p>
    </div>
  );
};

export default Main;

import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "./firebase";
import "./App.css";
import { useCookies } from "react-cookie";
import axiosInstance from "./axiosIntercepter";

interface IUser {
  email: string;
  role: number;
  uid: string;
  nickname: string;
  create_at: Date;
}

interface IPostData {
  message: string;
  user?: IUser;
  access_token?: string;
}
const Main = ({ user }: { user: IUser | undefined }) => {
  const [cookie, setCookie, removeCookie] = useCookies();
  // const [user, setUser] = useState<IUser | null>();
  const [token, setToken] = useState<string | null>();
  const navigate = useNavigate();
  // useEffect(() => {
  //   console.log(cookie);
  //     setUser(cookie.user);
  //   }
  // }, [cookie.user]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((data) => {
      if (!data) throw new Error("no data");
      axiosInstance
        .post("/login", {
          email: data.user.email,
          uid: data.user.uid,
        })
        .then((res) => {
          if (res.status === 204) {
            console.log(data.user);
            if (data.user) {
              navigate("/register", { state: JSON.stringify(data.user) });
            } else {
              return;
            }
          }
          //  else if (res.status === 200) {
          //   const { user, access_token }: IPostData = res.data;
          //   setUser(user);
          //   setCookie("user", user, {
          //     maxAge: 60 * 30,
          //   });
          // }
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

      <p>{user ? user.nickname : ""}</p>
    </div>
  );
};

export default Main;

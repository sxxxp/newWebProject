import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "./axiosIntercepter";

const Test = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  useEffect(() => {
    axiosInstance.get(`/user/${id!}`, {}).then((res) => {
      setUser(res.data["user"]);
    });
  }, []);
  return (
    <div>
      <h1>test</h1>
      <div>{JSON.stringify(user)}</div>
    </div>
  );
};

export default Test;

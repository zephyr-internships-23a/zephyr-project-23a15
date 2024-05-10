import AxiosInstance from "@/utils/AxiosInstance";
import { useState, useContext, createContext, useEffect } from "react";
// import { api_base_url } from "../CONSTANTS";
const initialState = {
  user: {
    id: null,
    is_auth: false,
    token: "",
  },
  setUser: () => { },
  user_data: {},
};
const AppContext = createContext(initialState);
export default function StoreProvider({ children }) {
  const [user, setUser] = useState({
    id: localStorage.getItem("id")
      ? JSON.parse(localStorage.getItem("id"))
      : null,
    is_auth: localStorage.getItem("token") ? true : false,
    token: "",
  });
  const [user_data, setUser_data] = useState({});
  const sharedState = {
    user: user,
    setUser: setUser,
    user_data: user_data,
  };
  console.log(user)
  useEffect(() => {
    async function checkAuthState() {
      const id = localStorage.getItem("id")
        ? JSON.parse(localStorage.getItem("id"))
        : null;
      const is_auth = localStorage.getItem("token") ? true : false;
      const token = localStorage.getItem("token");
      //implement get user functionality to retrieve current user data from token
      //along with  checking the authenticity of the token
      if (token) {
        try {
          const response = await AxiosInstance.get("/info");
          if (response.status == 200) {
            setUser_data(response.data?.user || {});
          }
        } catch (error) {
          if (error?.response?.data?.expired) {
            localStorage.clear();
            window.location.reload();
          }
          console.log(error);
        }
      }
      setUser({ id, is_auth, token });
    }
    checkAuthState();
  }, [user?.token]);
  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useStoreContext() {
  return useContext(AppContext);
}

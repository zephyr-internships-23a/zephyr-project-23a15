import { io } from "socket.io-client";
import { REACT_QUERY } from "@/constants/reactQuery";
import AxiosInstance from "@/utils/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useState, useContext, createContext, useEffect, useRef } from "react";
// import { api_base_url } from "../CONSTANTS";
const initialState = {
  user: {
    id: null,
    is_auth: false,
    token: "",
    account_type: "",
  },
  setUser: () => { },
  user_data: {},
  SocketClient: null
};
const AppContext = createContext(initialState);
export default function StoreProvider({ children }) {
  const [user, setUser] = useState({
    id: localStorage.getItem("id"),
    is_auth: localStorage.getItem("token") ? true : false,
    token: localStorage.getItem("token"),
    account_type: localStorage.getItem("account_type"),
  });
  const socketClient = useRef(null);
  const [user_data, setUser_data] = useState({});
  const sharedState = {
    user: user,
    setUser: setUser,
    user_data: user_data,
    SocketClient: socketClient.current
  };
  const userData = useQuery({
    queryKey: [REACT_QUERY.PROFILE],
    queryFn: async () => {
      const response = await AxiosInstance.get("/info");
      return response.data;
    },
    retry: false,
    enabled: user.token ? true : false,
  });
  useEffect(() => {
    function updateUserData() {
      if (userData?.isError && userData?.error?.response?.data?.expired) {
        console.log(userData.error);
        localStorage.clear();
        setUser({
          id: "",
          is_auth: false,
          token: "",
          account_type: "",

        });
        window.location.reload();
      } else {
        setUser_data(userData?.data?.user || {});
      }
    }
    updateUserData();
    socketClient.current = io('http://localhost:4000')
  }, [userData?.data, userData.isError]);

  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useStoreContext() {
  return useContext(AppContext);
}

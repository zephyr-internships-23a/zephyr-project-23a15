import { useState, useContext, createContext, useEffect } from "react";
// import { api_base_url } from "../CONSTANTS";
const initialState = {
  user: {
    id: null,
    is_auth: false,
    token: "",
  },
  setUser: () => {},
};
const AppContext = createContext(initialState);
export default function StoreProvider({ children }) {
  const [user, setUser] = useState({
    id: null,
    is_auth: false,
    token: "",
  });
  const sharedState = {
    user: user,
    setUser: setUser,
  };

  useEffect(() => {
    function checkAuthState() {
      const id = localStorage.getItem("id")
        ? JSON.parse(localStorage.getItem("id"))
        : null;
      const is_auth = localStorage.getItem("token") ? true : false;
      const token = localStorage.getItem("token");
      setUser({ id, is_auth, token });
    }
    checkAuthState();
  }, []
);
  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useStoreContext() {
  return useContext(AppContext);
}

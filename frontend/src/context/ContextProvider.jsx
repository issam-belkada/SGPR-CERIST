import { createContext, useState, useMemo, useContext, useEffect } from "react";

const StateContext = createContext({
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
});

export const ContextProvider = ({ children }) => {
  // Initialisation sécurisée à partir du localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("USER");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

  const setToken = (newToken) => {
    _setToken(newToken);
    if (newToken) {
      localStorage.setItem("ACCESS_TOKEN", newToken);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("USER");
      setUser(null);
    }
  };

  // Synchronisation du user avec le localStorage uniquement s'il change
  useEffect(() => {
    if (user) {
      localStorage.setItem("USER", JSON.stringify(user));
    } else {
      localStorage.removeItem("USER");
    }
  }, [user]);

  const contextValue = useMemo(() => ({
    user,
    setUser,
    token,
    setToken,
  }), [user, token]);

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
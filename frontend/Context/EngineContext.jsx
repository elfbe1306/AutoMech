import React, { createContext, useContext, useState } from "react";

const EngineContext = createContext();

export const useEngine = () => useContext(EngineContext);

export const EngineProvider = ({ children }) => {
  const [listEngine, setListEngine] = useState([]);
  
  return(
    <EngineContext.Provider value={{ listEngine, setListEngine }}>
      {children}
    </EngineContext.Provider>
  )
}
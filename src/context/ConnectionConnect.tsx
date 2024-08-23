"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your context state
interface ConnectionContextType {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

// Create the context with default values
const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined
);

// Create the provider component
interface ConnectionProviderProps {
  children: ReactNode;
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Function to simulate connection
  const connect = () => {
    // Implement connection logic here
    setIsConnected(true);
  };

  // Function to simulate disconnection
  const disconnect = () => {
    // Implement disconnection logic here
    setIsConnected(false);
  };

  return (
    <ConnectionContext.Provider value={{ isConnected, connect, disconnect }}>
      {children}
    </ConnectionContext.Provider>
  );
};

// Custom hook to use the context
export const useConnection = (): ConnectionContextType => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};

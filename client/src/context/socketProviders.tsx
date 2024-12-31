import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { type Socket, io } from "socket.io-client";

// define the socket URL
const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL; 
const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
	children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		// Connect to Socket.io server
		const newSocket = io(SOCKET_URL, {
			transports: ["websocket"], // Recommended for production
			autoConnect: false, // Initially disconnect
      reconnection: true, // Reconnect automatically
      reconnectionDelay: 1000, // Delay between reconnection attempts
      reconnectionAttempts: 10, // Number of reconnection attempts before giving up
		});

		newSocket.connect();
		setSocket(newSocket);

		// Clean up socket connection on unmount
		return () => {
			newSocket.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};

// Custom hook to use socket context
export const useSocket = () => {
	const socket = useContext(SocketContext);
	if (!socket) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return socket;
};

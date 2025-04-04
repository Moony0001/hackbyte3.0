"use client";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
        try {
            const res = await fetch("/api/auth/me");
            const data = await res.json();
            if (res.ok && data?.user) {
            setUser(data.user);
            } else {
            setUser(null);
            }
        } catch (err) {
            console.error("Error fetching user session:", err);
            setUser(null);
        }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={user}>
        {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function useUserDetails(role) {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!role) return; 

        const fetchUserDetails = async () => {
            const supabase = createClientComponentClient();
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("role", role); 

            if (error) {
                console.error(`Error fetching ${role} details:`, error);
                setError(error);
            } else {
                console.log(`Fetched ${role} details:`, data);
                setUserData(data);
            }
        };

        fetchUserDetails();
    }, [role]);

    return { userData, error };
}

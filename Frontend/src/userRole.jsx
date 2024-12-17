import { useEffect, useState } from "react";

const useUserRole = () => {
    const [role, setRole] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/role", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setRole(data.role);
                } else {
                    setError("Failed to fetch role");
                }
            } catch (err) {
                console.error("Error fetching role:", err);
                setError("Error fetching role");
            }
        };

        fetchRole();
    }, []);

    return { role, error };
};

export default useUserRole;

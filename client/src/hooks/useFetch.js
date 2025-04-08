import { useEffect, useState } from "react";

export const useFetch = (url, options = {}, dependencies = []) => {
    const [data, setData] = useState(null); // Ensure default state is null
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Ensure default state is null

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url, options);
                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message || `Error: ${response.statusText}`);
                }
                setData(responseData); // Set the fetched data
                setError(null); // Clear any previous errors
            } catch (err) {
                setError(err); // Set the error
                setData(null); // Clear any previous data
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchData();
    }, [url, ...dependencies]); // Include URL and dependencies

    return { data, loading, error };
};
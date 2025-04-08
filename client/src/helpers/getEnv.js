export const getEnv = (envname) => {
    const env = import.meta.env;
    return env[envname] || "http://localhost:3000/api"; // Default to backend URL
};
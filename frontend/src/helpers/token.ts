import { NavigateFunction } from "react-router-dom";

export const checkAuthenticationResponse = async (response: Response, setUser: any, setError: any, navigate: NavigateFunction) => {
    if (response.status === 401 || response.status === 403) {
        setUser();
        localStorage.removeItem("user");
        navigate("/sign-in");
    }
    const error = await response.text();
    return setError(error);
}
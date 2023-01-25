import { checkAuthenticationResponse } from "../../helpers/token";

export interface Attempt {
    verb: string;
    correct: boolean;
    username: string;
}

export const postAttempt = async (
    attempt: Attempt,
    user: any,
    setUser: any,
    setError: any,
    navigate: any
) => {
    if (user) {
        const response = await fetch(import.meta.env.VITE_ENDPOINT + "/attempt", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                Authentication: `Bearer ${user.token}`,
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(attempt),
        });

        if (!response.ok) {
            return await checkAuthenticationResponse(
                response,
                setUser,
                setError,
                navigate
            );
        }
    }
};
import { NavigateFunction } from "react-router-dom";
import { checkAuthenticationResponse } from "../../helpers/token";
import { User } from "../../Root";

export const fetchChat = async (
  endpoint: string,
  method: "GET" | "POST",
  prompt: any,
  token: string,
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>,
  setError: (value: React.SetStateAction<string>) => void,
  navigate: NavigateFunction
) => {
  try {
    const resp = await fetch(import.meta.env.VITE_ENDPOINT + endpoint, {
      method,
      body: JSON.stringify({ prompt: prompt }),
      headers: {
        Authentication: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!resp.ok) {
      return await checkAuthenticationResponse(
        resp,
        setUser,
        setError,
        navigate
      );
    }
    return await resp.json();
  } catch (e) {
    console.log(e);
    setError("There was an error fetching chat");
  }
};

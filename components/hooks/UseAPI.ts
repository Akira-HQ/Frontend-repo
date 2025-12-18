import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../AppContext";

interface ApiHook {
  callApi: (
    endpoint: string,
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    body?: any,
  ) => Promise<any>;
}

export const UseAPI = (): ApiHook => {
  const router = useRouter();
  const { setUser, addToast } = useAppContext();
  // const backendUrl = process.env.LOCAL_URL;
  const backendUrl = process.env.BACKEND_URI;

  const callApi = useCallback(
    async (
      endpoint: string,
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
      body: any = null,
    ) => {
      const token = localStorage.getItem("token");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const options: RequestInit = {
        method,
        headers,
      };
      if (body) {
        options.body = JSON.stringify(body);
      }
      console.log("backend url:", backendUrl)
      console.log("endpoint url:", endpoint)
      const response = await fetch(`${backendUrl}${endpoint}`, options);

      const newToken = response.headers.get("X-New-Token");
      if (newToken) {
        localStorage.setItem("token", newToken.replace("Bearer ", ""));
      }

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          setUser(null);
          router.push("/register/sign-in");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "An API error occured");
        addToast(errorData.message || "An API error occured", "error");
      }

      return response.json();
    },
    [router, setUser],
  );

  return { callApi };
};

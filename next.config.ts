import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BACKEND_URI: "https://akira-backend-vklc.onrender.com",
    LOCAL_URL: "http://localhost:8000",
  },
};

export default nextConfig;

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 5000,
    strictPort: false,
    proxy: {
      "/api": "http://localhost:3001",
    },
    allowedHosts: ["localhost", "discrete-rooster-repeatedly.ngrok-free.app"],
  },
});

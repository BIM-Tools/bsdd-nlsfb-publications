import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig(() => {
  const base = process.env.BASE_PATH || "./";

  return {
    root: "./",
    base,
    plugins: [react()],
  };
});

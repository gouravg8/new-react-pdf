import { defineConfig, type LibraryOptions } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

const libConfig: LibraryOptions = {
  entry: {
    index: path.resolve(__dirname, "src/index.ts"),
    SinglePage: path.resolve(__dirname, "src/Components/SinglePage.tsx"),
    Scrollable: path.resolve(__dirname, "src/Components/Scrollable.tsx"),
  },
  formats: ["es"],
  fileName: (_, entryName) => `${entryName}.js`,
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: libConfig,
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        dir: "dist",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});

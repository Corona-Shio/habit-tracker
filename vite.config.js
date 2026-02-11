import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function resolveBasePath() {
  const repository = process.env.GITHUB_REPOSITORY;
  if (process.env.GITHUB_ACTIONS === "true" && repository) {
    const repoName = repository.split("/")[1];
    return `/${repoName}/`;
  }
  return "/habit-tracker/";
}

export default defineConfig({
  base: resolveBasePath(),
  plugins: [react()]
});

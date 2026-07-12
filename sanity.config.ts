import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { projectId, dataset } from "./sanity/lib/client";

export default defineConfig({
  name: "default",
  title: "Sudipta Sarkar Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});

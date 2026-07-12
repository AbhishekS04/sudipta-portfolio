import { createClient } from "next-sanity";

export const projectId = "7pjayl1k";
export const dataset = "production";
export const apiVersion = "2026-07-11";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Live data for real-time updates in studio editor
});

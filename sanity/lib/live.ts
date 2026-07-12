import { defineLive } from "next-sanity/live";
import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // A viewer token is required for live previewing unpublished content.
  // Since we only need live updates for PUBLISHED content, no token is needed.
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

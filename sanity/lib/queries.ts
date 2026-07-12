import { groq } from "next-sanity";

// GROQ query to fetch all artworks from Sanity
export const artworksQuery = groq`
  *[_type == "artwork" && (defined(mainImage.asset) || defined(videoUrl))] | order(_createdAt desc) {
    "id": _id,
    title,
    client,
    description,
    "tags": coalesce(tags, []),
    videoUrl,
    "imageUrl": mainImage.asset->url,
    "width": mainImage.asset->metadata.dimensions.width,
    "height": mainImage.asset->metadata.dimensions.height,
    "images": [mainImage.asset->url] + coalesce(images[]{asset->}.asset->url, []),
    "imagesCount": 1 + coalesce(count(images), 0)
  }
`;


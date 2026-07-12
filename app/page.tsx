import ArtistPortfolio from "./components/ArtistPortfolio";
import { Artwork } from "./components/MasonryGrid";
import { sanityFetch, SanityLive } from "../sanity/lib/live";
import { artworksQuery } from "../sanity/lib/queries";

export default async function Home() {
  const { data } = await sanityFetch({ query: artworksQuery });
  const artworks = (data ?? []) as Artwork[];

  return (
    <>
      <ArtistPortfolio initialArtworks={artworks ?? []} />
      {/* SanityLive enables real-time updates — publishes in Sanity reflect instantly */}
      <SanityLive />
    </>
  );
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Jornada com Deus",
    short_name: "Jornada",
    description: "Uma jornada diária para fortalecer sua caminhada com Deus.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F5F0E7",
    theme_color: "#78664F",
    icons: [
      {
        src: "/icons/jornada-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/jornada-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

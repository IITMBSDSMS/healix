import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Healix Technologies",
    short_name: "Healix",
    description: "Healix Technologies — AI Healthcare, Women's Safety & Engineering Academy (जैव-चिकित्सीय अनुसंधान एवं अभियांत्रिकी केंद्र)",
    start_url: "/",
    display: "standalone",
    background_color: "#080B14",
    theme_color: "#ea580c",
    icons: [
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/official-logo-web.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

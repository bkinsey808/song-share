import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: process.env.NEXT_PUBLIC_BRAND_LONG ?? "Song Share",
		short_name: process.env.NEXT_PUBLIC_BRAND ?? "Song Share",
		description:
			process.env.NEXT_PUBLIC_BRAND_DESC ??
			"Song Share lets you share songs with your community.",
		start_url: "/",
		display: "standalone",
		background_color: "#000000",
		theme_color: "#ffffff",
		icons: [
			{
				src: "/web-app-manifest-192x192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/web-app-manifest-512x512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
	};
}

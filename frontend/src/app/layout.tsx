import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Travel Buddy AI - Your AI-Powered Travel Companion",
	description: "Plan your perfect trip with AI. Discover destinations, plan budgets, and create detailed itineraries powered by artificial intelligence.",
	keywords: "travel, AI, itinerary, budget, destinations, trip planning, vacation",
	authors: [{ name: "Travel Buddy AI" }],
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">{children}</body>
		</html>
	);
}

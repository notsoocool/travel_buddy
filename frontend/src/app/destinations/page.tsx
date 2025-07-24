"use client";

import { useState } from "react";
import { MapPin, Search, Loader2, ArrowLeft, Sparkles, DollarSign, Calendar } from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface DestinationResponse {
	destinations: string;
}

export default function DestinationsPage() {
	const [interest, setInterest] = useState("");
	const [destinations, setDestinations] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!interest.trim()) return;

		setLoading(true);
		setError("");
		setDestinations([]);

		try {
			console.log("Sending request to API...");
			const response = await axios.post<DestinationResponse>("http://localhost:8000/suggest-destinations", { interest: interest.trim() });

			console.log("API Response:", response.data);

			// Parse the destinations string into an array
			const destinationsString = response.data.destinations || "";
			console.log("Destinations string:", destinationsString);

			const destinationsArray = destinationsString
				.split(",")
				.map((d) => d.trim())
				.filter((d) => d);
			console.log("Parsed destinations array:", destinationsArray);

			setDestinations(destinationsArray);
		} catch (err: any) {
			console.error("API Error:", err);

			if (err.response?.status === 401) {
				setError("API authentication failed. Please check the Hugging Face API token configuration.");
			} else if (err.response?.status === 500) {
				setError("Server error. The AI service is currently unavailable.");
			} else if (err.code === "ECONNREFUSED") {
				setError("Cannot connect to the server. Please make sure the backend is running.");
			} else {
				setError(`Failed to fetch destinations: ${err.message || "Unknown error"}`);
			}
		} finally {
			setLoading(false);
		}
	};

	// Ensure destinations is always an array
	const safeDestinations = Array.isArray(destinations) ? destinations : [];

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			{/* Navigation */}
			<nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<Link href="/" className="flex items-center space-x-2">
							<ArrowLeft className="h-5 w-5 text-gray-600" />
							<span className="text-gray-600 hover:text-gray-900">Back to Home</span>
						</Link>
						<div className="flex items-center space-x-2">
							<MapPin className="h-6 w-6 text-blue-600" />
							<span className="text-lg font-semibold text-gray-900">Destination Discovery</span>
						</div>
					</div>
				</div>
			</nav>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Your Perfect Destination</h1>
					<p className="text-xl text-gray-600">Tell us what interests you, and our AI will suggest amazing destinations for your next trip.</p>
				</div>

				{/* Search Form */}
				<div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2">
								What are you interested in?
							</label>
							<textarea
								id="interest"
								value={interest}
								onChange={(e) => setInterest(e.target.value)}
								placeholder="e.g., I love beaches, hiking, historical sites, food culture, adventure sports, art museums, nightlife, nature, architecture, shopping..."
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
								rows={4}
								required
							/>
							<p className="mt-2 text-sm text-gray-500">Be as specific as possible to get better recommendations!</p>
						</div>

						<button
							type="submit"
							disabled={loading || !interest.trim()}
							className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-5 w-5 animate-spin" />
									Finding Destinations...
								</>
							) : (
								<>
									<Search className="mr-2 h-5 w-5" />
									Find Destinations
								</>
							)}
						</button>
					</form>
				</div>

				{/* Results */}
				{error && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
						<h3 className="font-semibold text-red-800 mb-2">Error</h3>
						<p className="text-red-700">{error}</p>
						{error.includes("API authentication failed") && (
							<div className="mt-3 p-3 bg-red-100 rounded">
								<p className="text-sm text-red-800">
									<strong>Solution:</strong> The Hugging Face API token needs to be configured. Please add your API token to the backend/.env file:
								</p>
								<code className="block mt-2 text-xs bg-red-200 p-2 rounded">HUGGINGFACE_API_TOKEN=your_token_here</code>
							</div>
						)}
					</div>
				)}

				{safeDestinations.length > 0 && (
					<div className="bg-white rounded-2xl shadow-xl p-8">
						<div className="flex items-center mb-6">
							<Sparkles className="h-6 w-6 text-blue-600 mr-2" />
							<h2 className="text-2xl font-bold text-gray-900">Recommended Destinations</h2>
						</div>

						<div className="grid gap-4">
							{safeDestinations.map((destination, index) => (
								<div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 text-gray-900">
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<MapPin className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
											<span className="text-lg font-medium text-gray-900">{destination}</span>
										</div>
										<div className="flex space-x-2">
											<Link
												href={`/budget?destination=${encodeURIComponent(destination)}`}
												className="flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
											>
												<DollarSign className="h-4 w-4 mr-1" />
												Budget
											</Link>
											<Link
												href={`/itinerary?destination=${encodeURIComponent(destination)}`}
												className="flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
											>
												<Calendar className="h-4 w-4 mr-1" />
												Itinerary
											</Link>
										</div>
									</div>
								</div>
							))}
						</div>

						<div className="mt-8 pt-6 border-t border-gray-200">
							<p className="text-gray-600 text-center">Click on any destination to plan your budget or create an itinerary!</p>
						</div>
					</div>
				)}

				{/* Tips */}
				{!loading && safeDestinations.length === 0 && !error && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
						<h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips for Better Results</h3>
						<ul className="space-y-2 text-blue-800">
							<li>• Mention specific activities you enjoy (hiking, swimming, shopping, etc.)</li>
							<li>• Include your preferred climate or season</li>
							<li>• Specify if you prefer cities, nature, or a mix</li>
							<li>• Mention any cultural interests (food, history, art, etc.)</li>
							<li>• Include your travel style (luxury, budget, adventure, relaxation)</li>
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}

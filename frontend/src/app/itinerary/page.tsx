"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Loader2, ArrowLeft, List, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useSearchParams } from "next/navigation";

interface ItineraryResponse {
	itinerary: string;
}

export default function ItineraryPage() {
	const searchParams = useSearchParams();
	const [destination, setDestination] = useState("");
	const [days, setDays] = useState(3);
	const [interest, setInterest] = useState("interesting_places");
	const [itinerary, setItinerary] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Read destination from URL parameters
	useEffect(() => {
		const urlDestination = searchParams.get("destination");
		if (urlDestination) {
			setDestination(decodeURIComponent(urlDestination));
		}
	}, [searchParams]);

	const interestOptions = [
		{ value: "interesting_places", label: "Must-See Attractions", description: "Famous landmarks and popular tourist spots" },
		{ value: "food_culture", label: "Food & Culture", description: "Local cuisine, restaurants, and cultural experiences" },
		{ value: "nature_adventure", label: "Nature & Adventure", description: "Outdoor activities, parks, and adventure sports" },
		{ value: "shopping_nightlife", label: "Shopping & Nightlife", description: "Shopping districts, markets, and entertainment" },
		{ value: "history_museums", label: "History & Museums", description: "Historical sites, museums, and cultural heritage" },
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!destination.trim()) return;

		setLoading(true);
		setError("");
		setItinerary("");

		try {
			const response = await axios.post<ItineraryResponse>("http://localhost:8000/itinerary", {
				destination: destination.trim(),
				days,
				interest,
			});
			setItinerary(response.data.itinerary || "");
		} catch (err: unknown) {
			setError("Failed to generate itinerary. Please try again.");
			console.error("Error generating itinerary:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
			{/* Navigation */}
			<nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<Link href="/destinations" className="flex items-center space-x-2">
							<ArrowLeft className="h-5 w-5 text-gray-600" />
							<span className="text-gray-600 hover:text-gray-900">Back to Destinations</span>
						</Link>
						<div className="flex items-center space-x-2">
							<Calendar className="h-6 w-6 text-purple-600" />
							<span className="text-lg font-semibold text-gray-900">Itinerary Generator</span>
						</div>
					</div>
				</div>
			</nav>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Perfect Itinerary</h1>
					<p className="text-xl text-gray-600">
						Get a detailed day-by-day plan for your trip to <span className="font-semibold text-purple-600">{destination || "your destination"}</span>.
					</p>
				</div>

				{/* Itinerary Form */}
				<div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Destination */}
						<div>
							<label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
								Destination
							</label>
							<div className="relative">
								<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									type="text"
									id="destination"
									value={destination}
									onChange={(e) => setDestination(e.target.value)}
									placeholder="e.g., Paris, Tokyo, New York, Bali..."
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
									required
								/>
							</div>
						</div>

						{/* Trip Duration */}
						<div>
							<label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
								Trip Duration (days)
							</label>
							<div className="relative">
								<Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									type="number"
									id="days"
									value={days}
									onChange={(e) => setDays(parseInt(e.target.value) || 1)}
									min="1"
									max="30"
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
								/>
							</div>
						</div>

						{/* Interests */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">What interests you most?</label>
							<div className="grid gap-3">
								{interestOptions.map((option) => (
									<label
										key={option.value}
										className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
											interest === option.value ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-gray-400"
										}`}
									>
										<input
											type="radio"
											name="interest"
											value={option.value}
											checked={interest === option.value}
											onChange={(e) => setInterest(e.target.value)}
											className="sr-only"
										/>
										<div className="flex-1 text-gray-900">
											<div className="font-medium text-gray-900">{option.label}</div>
											<div className="text-sm text-gray-500">{option.description}</div>
										</div>
										{interest === option.value && (
											<div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
												<div className="w-2 h-2 bg-white rounded-full"></div>
											</div>
										)}
									</label>
								))}
							</div>
						</div>

						<button
							type="submit"
							disabled={loading || !destination.trim()}
							className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-5 w-5 animate-spin" />
									Generating Itinerary...
								</>
							) : (
								<>
									<List className="mr-2 h-5 w-5" />
									Generate Itinerary
								</>
							)}
						</button>
					</form>
				</div>

				{/* Results */}
				{error && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
						<p className="text-red-700">{error}</p>
					</div>
				)}

				{itinerary && (
					<div className="bg-white rounded-2xl shadow-xl p-8">
						<div className="flex items-center mb-6">
							<Calendar className="h-6 w-6 text-purple-600 mr-2" />
							<h2 className="text-2xl font-bold text-gray-900">
								Your {days}-Day Itinerary for {destination}
							</h2>
						</div>

						<div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
							<div className="prose prose-lg max-w-none text-gray-900">
								<ReactMarkdown>{itinerary}</ReactMarkdown>
							</div>
						</div>

						<div className="mt-8 pt-6 border-t border-gray-200">
							<div className="flex justify-center space-x-4">
								<Link
									href={`/budget?destination=${encodeURIComponent(destination)}`}
									className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
								>
									<DollarSign className="h-4 w-4 mr-2" />
									Plan Budget
								</Link>
								<Link
									href="/destinations"
									className="flex items-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
								>
									<MapPin className="h-4 w-4 mr-2" />
									Choose Different Destination
								</Link>
							</div>
						</div>
					</div>
				)}

				{/* Tips */}
				{!loading && !itinerary && !error && (
					<div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
						<h3 className="text-lg font-semibold text-purple-900 mb-3">💡 Itinerary Planning Tips</h3>
						<ul className="space-y-2 text-purple-800">
							<li>• Consider opening hours and best times to visit attractions</li>
							<li>• Group nearby activities together to minimize travel time</li>
							<li>• Leave some flexibility for spontaneous discoveries</li>
							<li>• Check if attractions require advance booking</li>
							<li>• Consider local holidays and peak seasons</li>
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}

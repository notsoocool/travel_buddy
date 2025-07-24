"use client";

import { useState, useEffect } from "react";
import { DollarSign, Calendar, MapPin, Loader2, ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useSearchParams } from "next/navigation";

interface BudgetResponse {
	budget: string;
}

export default function BudgetPage() {
	const searchParams = useSearchParams();
	const [destination, setDestination] = useState("");
	const [days, setDays] = useState(5);
	const [style, setStyle] = useState("mid-range");
	const [budget, setBudget] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Read destination from URL parameters
	useEffect(() => {
		const urlDestination = searchParams.get("destination");
		if (urlDestination) {
			setDestination(decodeURIComponent(urlDestination));
		}
	}, [searchParams]);

	const travelStyles = [
		{ value: "budget", label: "Budget", description: "Hostels, street food, public transport" },
		{ value: "mid-range", label: "Mid-Range", description: "Hotels, restaurants, mix of transport" },
		{ value: "luxury", label: "Luxury", description: "High-end hotels, fine dining, private transport" },
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!destination.trim()) return;

		setLoading(true);
		setError("");
		setBudget("");

		try {
			const response = await axios.post<BudgetResponse>("http://localhost:8000/budget", {
				destination: destination.trim(),
				days,
				style,
			});
			setBudget(response.data.budget || "");
		} catch (err: unknown) {
			setError("Failed to calculate budget. Please try again.");
			console.error("Error calculating budget:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
			{/* Navigation */}
			<nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<Link href="/destinations" className="flex items-center space-x-2">
							<ArrowLeft className="h-5 w-5 text-gray-600" />
							<span className="text-gray-600 hover:text-gray-900">Back to Destinations</span>
						</Link>
						<div className="flex items-center space-x-2">
							<DollarSign className="h-6 w-6 text-green-600" />
							<span className="text-lg font-semibold text-gray-900">Budget Planner</span>
						</div>
					</div>
				</div>
			</nav>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">Plan Your Travel Budget</h1>
					<p className="text-xl text-gray-600">
						Get detailed cost estimates for your trip to <span className="font-semibold text-green-600">{destination || "your destination"}</span>.
					</p>
				</div>

				{/* Budget Form */}
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
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
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
								<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									type="number"
									id="days"
									value={days}
									onChange={(e) => setDays(parseInt(e.target.value) || 1)}
									min="1"
									max="365"
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
								/>
							</div>
						</div>

						{/* Travel Style */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">Travel Style</label>
							<div className="grid gap-3">
								{travelStyles.map((travelStyle) => (
									<label
										key={travelStyle.value}
										className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
											style === travelStyle.value ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
										} text-gray-900`}
									>
										<input
											type="radio"
											name="style"
											value={travelStyle.value}
											checked={style === travelStyle.value}
											onChange={(e) => setStyle(e.target.value)}
											className="sr-only"
										/>
										<div className="flex-1 text-gray-900">
											<div className="font-medium text-gray-900">{travelStyle.label}</div>
											<div className="text-sm text-gray-500">{travelStyle.description}</div>
										</div>
										{style === travelStyle.value && (
											<div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
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
							className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-5 w-5 animate-spin" />
									Calculating Budget...
								</>
							) : (
								<>
									<TrendingUp className="mr-2 h-5 w-5" />
									Calculate Budget
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

				{budget && (
					<div className="bg-white rounded-2xl shadow-xl p-8">
						<div className="flex items-center mb-6">
							<DollarSign className="h-6 w-6 text-green-600 mr-2" />
							<h2 className="text-2xl font-bold text-gray-900">Budget Estimate for {destination}</h2>
						</div>
						<div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
							<div className="prose prose-lg max-w-none text-gray-900">
								<div className="whitespace-pre-wrap text-gray-800">{budget}</div>
							</div>
						</div>
						<div className="mt-8 pt-6 border-t border-gray-200">
							<div className="flex justify-center space-x-4">
								<Link
									href={`/itinerary?destination=${encodeURIComponent(destination)}`}
									className="flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
								>
									<Calendar className="h-4 w-4 mr-2" />
									Plan Itinerary
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
				{!loading && !budget && !error && (
					<div className="bg-green-50 border border-green-200 rounded-lg p-6">
						<h3 className="text-lg font-semibold text-green-900 mb-3">💡 Budget Planning Tips</h3>
						<ul className="space-y-2 text-green-800">
							<li>• Consider seasonal price variations for your destination</li>
							<li>• Factor in additional costs like travel insurance and visas</li>
							<li>• Budget for unexpected expenses (emergency fund)</li>
							<li>• Research local currency and exchange rates</li>
							<li>• Consider transportation costs between attractions</li>
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}

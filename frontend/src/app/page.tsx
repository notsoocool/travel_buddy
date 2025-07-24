import { Globe, MapPin, DollarSign, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			{/* Navigation */}
			<nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-2">
							<Globe className="h-8 w-8 text-blue-600" />
							<span className="text-xl font-bold text-gray-900">Travel Buddy AI</span>
						</div>
						<div className="hidden md:flex items-center space-x-8">
							<Link href="/destinations" className="text-gray-600 hover:text-blue-600 transition-colors">
								Destinations
							</Link>
							<Link href="/budget" className="text-gray-600 hover:text-blue-600 transition-colors">
								Budget Planner
							</Link>
							<Link href="/itinerary" className="text-gray-600 hover:text-blue-600 transition-colors">
								Itinerary
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<div className="relative overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
					<div className="text-center">
						<h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
							Plan Your Perfect Trip with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI</span>
						</h1>
						<p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
							Discover amazing destinations, plan your budget, and create detailed itineraries powered by artificial intelligence. Your next adventure starts
							here.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="/destinations"
								className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
							>
								<MapPin className="mr-2 h-5 w-5" />
								Find Destinations
							</Link>
							<Link
								href="/budget"
								className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors shadow-lg hover:shadow-xl"
							>
								<DollarSign className="mr-2 h-5 w-5" />
								Plan Budget
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="py-24 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need for Your Trip</h2>
						<p className="text-lg text-gray-600">Our AI-powered tools help you plan every aspect of your journey</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{/* Destination Discovery */}
						<div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
								<MapPin className="h-8 w-8 text-white" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Destination Discovery</h3>
							<p className="text-gray-600 mb-6">Tell us your interests and let AI suggest the perfect destinations for your next adventure.</p>
							<Link href="/destinations" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
								Explore Destinations
								<Sparkles className="ml-2 h-4 w-4" />
							</Link>
						</div>

						{/* Budget Planning */}
						<div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
								<DollarSign className="h-8 w-8 text-white" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-4">Intelligent Budget Planning</h3>
							<p className="text-gray-600 mb-6">Get detailed cost estimates for your trip based on destination, duration, and travel style.</p>
							<Link href="/budget" className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold">
								Plan Your Budget
								<Sparkles className="ml-2 h-4 w-4" />
							</Link>
						</div>

						{/* Itinerary Generation */}
						<div className="text-center p-8 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-6">
								<Calendar className="h-8 w-8 text-white" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Generated Itineraries</h3>
							<p className="text-gray-600 mb-6">Create detailed day-by-day itineraries tailored to your interests and schedule.</p>
							<Link href="/itinerary" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold">
								Create Itinerary
								<Sparkles className="ml-2 h-4 w-4" />
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="flex items-center justify-center space-x-2 mb-4">
						<Globe className="h-6 w-6 text-blue-400" />
						<span className="text-lg font-semibold">Travel Buddy AI</span>
					</div>
					<p className="text-gray-400">Your AI-powered travel companion for unforgettable adventures</p>
				</div>
			</footer>
		</div>
	);
}

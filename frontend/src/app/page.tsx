"use client";

import { useState } from "react";
import { Globe, MapPin, DollarSign, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
	const [hoveredCard, setHoveredCard] = useState<string | null>(null);

	const features = [
		{
			id: "destinations",
			title: "Discover Destinations",
			description: "Get AI-powered recommendations based on your interests",
			icon: MapPin,
			href: "/destinations",
			color: "from-blue-500 to-purple-600",
		},
		{
			id: "budget",
			title: "Plan Your Budget",
			description: "Get detailed cost estimates for your dream trip",
			icon: DollarSign,
			href: "/budget",
			color: "from-green-500 to-emerald-600",
		},
		{
			id: "itinerary",
			title: "Create Itinerary",
			description: "Generate day-by-day plans tailored to your preferences",
			icon: Calendar,
			href: "/itinerary",
			color: "from-purple-500 to-pink-600",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="text-center mb-16">
					<div className="flex items-center justify-center mb-6">
						<Globe className="h-12 w-12 text-blue-600 mr-3" />
						<h1 className="text-5xl font-bold text-gray-900">Travel Buddy AI</h1>
					</div>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
						Your AI-powered travel companion that helps you discover amazing destinations, plan budgets, and create detailed itineraries. Let artificial
						intelligence make your travel planning effortless and exciting.
					</p>
					<div className="flex items-center justify-center mt-4">
						<Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
						<span className="text-sm text-gray-500">Powered by DeepSeek AI</span>
					</div>
				</div>

				<div className="grid md:grid-cols-3 gap-8 mb-16">
					{features.map((feature) => (
						<Link
							key={feature.id}
							href={feature.href}
							className="group"
							onMouseEnter={() => setHoveredCard(feature.id)}
							onMouseLeave={() => setHoveredCard(null)}
						>
							<div
								className={`
                bg-white rounded-2xl shadow-lg p-8 h-full transition-all duration-300 
                group-hover:shadow-xl group-hover:-translate-y-1
                ${hoveredCard === feature.id ? "ring-2 ring-blue-200" : ""}
              `}
							>
								<div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
									<feature.icon className="h-8 w-8 text-white" />
								</div>
								<h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
								<p className="text-gray-600 leading-relaxed">{feature.description}</p>
								<div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
									Get Started
									<svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
								</div>
							</div>
						</Link>
					))}
				</div>

				<div className="text-center">
					<div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
						<h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
						<div className="grid md:grid-cols-3 gap-8">
							<div className="text-center">
								<div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
									<span className="text-blue-600 font-bold text-lg">1</span>
								</div>
								<h3 className="font-semibold text-gray-900 mb-2">Tell Us Your Interests</h3>
								<p className="text-gray-600 text-sm">Describe what you love - beaches, culture, adventure, food, or anything else!</p>
							</div>
							<div className="text-center">
								<div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
									<span className="text-green-600 font-bold text-lg">2</span>
								</div>
								<h3 className="font-semibold text-gray-900 mb-2">Get AI Recommendations</h3>
								<p className="text-gray-600 text-sm">Our AI analyzes your preferences and suggests perfect destinations.</p>
							</div>
							<div className="text-center">
								<div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
									<span className="text-purple-600 font-bold text-lg">3</span>
								</div>
								<h3 className="font-semibold text-gray-900 mb-2">Plan Your Trip</h3>
								<p className="text-gray-600 text-sm">Create budgets and detailed itineraries with just a few clicks.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

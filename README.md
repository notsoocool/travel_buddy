# 🌍 Travel Buddy AI - Your AI-Powered Travel Companion

> _"Where AI meets adventure - Plan your perfect trip with intelligent recommendations"_

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![DeepSeek AI](https://img.shields.io/badge/DeepSeek%20AI-V3-blue?style=for-the-badge)](https://deepseek.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3+-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Backend on Render](https://img.shields.io/badge/Backend%20on-Render-46E3B7?style=for-the-badge&logo=render)](https://render.com/)

## ✨ Features

### 🎯 **Smart Destination Discovery**

- **AI-Powered Recommendations**: Get 5 personalized destinations based on your interests
- **Multi-Source Intelligence**: Combines DeepSeek AI, OpenTripMap API, and curated databases
- **Interest-Based Matching**: From beaches to culture, adventure to luxury - we've got you covered

### 💰 **Intelligent Budget Planning**

- **Context-Aware Estimates**: AI generates realistic budgets considering destination, duration, and travel style
- **Multiple Travel Styles**: Budget, Mid-Range, and Luxury options
- **Comprehensive Cost Breakdown**: Flights, accommodation, food, transport, and activities

### 📅 **Detailed Itinerary Generation**

- **Day-by-Day Planning**: Structured morning, afternoon, and evening activities
- **Interest-Focused**: Tailored to your preferences (attractions, food, nature, shopping, history)
- **Markdown Formatting**: Beautiful, readable itineraries with proper formatting

### 🔄 **Seamless Pipeline Workflow**

- **One-Click Navigation**: Click any destination to plan budget or create itinerary
- **Pre-filled Forms**: No need to re-enter destination information
- **Cross-Page Integration**: Easy flow between discovery, budgeting, and planning

## 🚀 Live Demo

**Frontend**: [https://travel-buddy-ashy.vercel.app](https://travel-buddy-ashy.vercel.app)  
**Backend API**: [https://travel-buddy-l44v.onrender.com](https://travel-buddy-l44v.onrender.com)

## 🛠️ Technology Stack

### **Frontend**

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API communication
- **React Markdown** - Markdown rendering for itineraries
- **Lucide React** - Beautiful icons
- **Bun** - Fast package manager and runtime

### **Backend**

- **FastAPI** - Modern Python web framework
- **DeepSeek AI** - Advanced language model for intelligent responses
- **OpenTripMap API** - Real-world destination data
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server
- **Python-dotenv** - Environment variable management

### **Deployment**

- **Vercel** - Frontend hosting with automatic deployments
- **Render** - Backend hosting with auto-scaling
- **CORS** - Cross-origin resource sharing for production

## 🎨 User Experience

### **1. Destination Discovery**

```
User Input: "I love beaches, hiking, and trying local food"
AI Response: "Japan, Bali, Costa Rica, Greece, Thailand"
```

### **2. Budget Planning**

```
Destination: Japan
Duration: 7 days
Style: Mid-Range
AI Response: "Estimated budget: ₹85,000 (flights, hotels, food, transport)"
```

### **3. Itinerary Creation**

```
Destination: Japan
Duration: 7 days
Interests: Food & Culture
AI Response: Detailed day-by-day plan with local experiences
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   APIs          │
│                 │    │                 │    │                 │
│ • Destinations  │    │ • Destination   │    │ • DeepSeek AI   │
│ • Budget        │    │   Agent         │    │ • OpenTripMap   │
│ • Itinerary     │    │ • Budget Agent  │    │ • Hugging Face  │
│ • Pipeline UI   │    │ • Itinerary     │    │   Router        │
└─────────────────┘    │   Agent         │    └─────────────────┘
                       └─────────────────┘
```

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+ or Bun
- Python 3.8+
- Hugging Face API token
- OpenTripMap API key (optional)

### **Frontend Setup**

```bash
cd frontend
bun install
bun run dev
```

### **Backend Setup**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### **Environment Variables**

Create `.env` file in backend directory:

```env
HUGGINGFACE_API_TOKEN=your_token_here
OPENTRIPMAP_API_KEY=your_key_here
```

## 📁 Project Structure

```
travel_buddy/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx     # Homepage
│   │   │   ├── destinations/page.tsx
│   │   │   ├── budget/page.tsx
│   │   │   └── itinerary/page.tsx
│   │   └── globals.css
│   └── package.json
├── backend/                  # FastAPI backend
│   ├── agents/
│   │   ├── destination_agent.py
│   │   ├── budget_agent.py
│   │   └── itenary_agent.py
│   ├── models/
│   │   └── flan_wrapper.py
│   ├── schemas/
│   │   └── all_schemas.py
│   ├── utils/
│   │   └── prompts.py
│   ├── main.py
│   └── requirements.txt
└── README.md
```

## 🔧 API Endpoints

### **Destination Discovery**

```http
POST /suggest-destinations
Content-Type: application/json

{
  "interest": "I love beaches and hiking"
}
```

### **Budget Planning**

```http
POST /budget
Content-Type: application/json

{
  "destination": "Japan",
  "days": 7,
  "style": "mid-range"
}
```

### **Itinerary Generation**

```http
POST /itinerary
Content-Type: application/json

{
  "destination": "Japan",
  "days": 7,
  "interest": "food_culture"
}
```

## 🎯 Key Features Explained

### **Multi-Agent Architecture**

- **Destination Agent**: Combines AI, API, and database for comprehensive recommendations
- **Budget Agent**: Uses DeepSeek AI for context-aware cost estimation
- **Itinerary Agent**: Generates detailed day-by-day plans with fallback mechanisms

### **Intelligent Fallbacks**

- **API Failures**: Graceful degradation to database/LLM responses
- **Token Issues**: Helpful error messages with setup instructions
- **Network Errors**: User-friendly error handling with retry suggestions

### **Pipeline Workflow**

- **Seamless Navigation**: Click destinations to plan budget or create itinerary
- **Pre-filled Forms**: Destination automatically populated from URL parameters
- **Cross-Page Integration**: Easy flow between all features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/travel-buddy/issues)
- **Email**: vyasyajush@gmail.com

---

<div align="center">

**Made with ❤️ by [Your Name]**

_"Adventure awaits - Let AI be your travel companion!"_

</div>

📊 NiveshSathi – Frontend

NiveshSathi is an AI-powered mutual fund analysis platform that helps users discover, compare, and get personalized investment recommendations based on risk appetite and goals.
This repository contains the frontend of the application.

🌐 Live Application
  👉 https://niveshsathi.vercel.app/
  
👥 Contributors

    Nachiket Tonge
    GitHub: https://github.com/C0deHungeR
    
    Dipanshu Milmile
    GitHub: https://github.com/dipanshumilmile
    
    Amit Raghuse
    GitHub: https://github.com/raghuseAmit
    
    Vipin Adle
    GitHub: https://github.com/Vipin555
    
  

✨ Key Features

    🔐 User Authentication (Signup / Login)
    🤖 AI-powered mutual fund recommendations
    📈 Lumpsum & SIP investment analysis
    💬 AI fund chat (Groq LLM)
    🧭 Clean, responsive UI
    🔗 Secure backend & ML service integration

🛠️ Tech Stack

      Framework: Next.js (App Router)
      Language: JavaScript (React)
      Styling: Tailwind CSS
      AI: Groq LLM
      Auth: JWT (via backend)
      Deployment: Vercel

  📂 Project Structure
  
        src/
      ├── app/
      │   ├── api/
      │   ├── auth/
      │   ├── ai-recommendation/
      │   ├── funds/
      │   ├── profile/
      │   └── layout.js
      │
      ├── components/
      ├── lib/
      │   ├── api.js
      │   └── config.js
      └── styles/

🔑 Environment Variables

    # AI (server-side only)
    GROQ_API_KEY=your_groq_api_key
    GROQ_MODEL=llama-3.3-70b-versatile
    # Backend
    NEXT_PUBLIC_BACKEND_URL=https://nivesh-sathi-backend.onrender.com/api

🔐 Authentication Flow (Frontend)

    User signs up or logs in
    Backend returns a plain JWT token
    Token is stored in localStorage
    Authenticated requests include:

🤖 AI Recommendation Flow

    User Input
       ↓
    Frontend (Next.js)
       ↓
    Backend API
       ↓
    ML Service
       ↓
    AI Recommendations

🌍 Live Deployment

    The frontend is deployed and live on Vercel:
    👉 https://nivesh-sathi-frontend.vercel.app/
    Backend and ML services are deployed separately.


    



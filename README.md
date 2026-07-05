# 🚀 AI Job Hunter

> **AI-powered career copilot for smarter job applications.**

AI Job Hunter is a full-stack AI application that helps job seekers optimize every stage of the hiring process. Powered by **Groq's ultra-fast LLM inference**, it provides intelligent feedback on resumes, LinkedIn profiles, portfolios, cover letters, and interview preparation.

Whether you're applying for internships, campus placements, or full-time roles, AI Job Hunter helps you create stronger applications and improve your interview readiness with personalized AI insights.

---

## ✨ Features

### 📄 Resume Analyzer
- ATS compatibility analysis
- Resume scoring
- Keyword gap detection
- AI-powered bullet point improvements
- Actionable recruiter feedback

### 💼 LinkedIn Profile Review
- Headline optimization
- About section analysis
- Profile strength evaluation
- Recruiter visibility suggestions
- LinkedIn SEO improvements

### 🌐 Portfolio Review
- Project quality assessment
- Technical skill evaluation
- Missing technologies analysis
- PAR (Problem-Action-Result) story generation
- Portfolio improvement recommendations

### 🎯 Job Match Analyzer
- Compare resume against job descriptions
- Match percentage calculation
- Missing skills detection
- Strength and weakness analysis
- Personalized recommendations

### ✉️ Cover Letter Generator
- Generate tailored cover letters
- Company-specific customization
- Multiple writing styles
- Professional formatting

### 🎤 Interview Preparation
- Technical interview questions
- Behavioral interview questions
- AI answer evaluation
- Sample responses
- Personalized improvement tips

---

# 🛠 Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

## Backend
- Node.js
- Express.js
- Multer
- Groq SDK

## AI
- Groq API
- Llama 3.x

## Deployment
- Vercel (Frontend)
- Render (Backend)

---

# 🧠 AI Workflow

```
User Input
     │
     ▼
React Frontend
     │
     ▼
Express Backend
     │
     ▼
Groq API
     │
     ▼
Llama 3 Model
     │
     ▼
AI Analysis
     │
     ▼
Interactive Results
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js 18+
- Groq API Key

---

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-job-hunter.git
cd ai-job-hunter
```

---

# Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
GROQ_API_KEY=your_api_key_here
PORT=5000
```

Start the backend:

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

---

# 📂 Project Structure

```
ai-job-hunter
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── services
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
```

---

# 🌟 Highlights

- ⚡ Powered by Groq's low-latency inference
- 🤖 AI-driven career assistant
- 📄 ATS resume optimization
- 💼 LinkedIn profile analysis
- 🌐 Portfolio evaluation
- 🎯 Job description matching
- ✉️ AI-generated cover letters
- 🎤 Interview preparation with AI feedback
- 📱 Fully responsive modern UI
- ☁️ Cloud deployment using Vercel and Render

---

# 📸 Screenshots

> Add screenshots or GIFs of:
>
> - Home Page
> - Resume Analyzer
> - Job Match
> - LinkedIn Review
> - Portfolio Review
> - Interview Preparation
> - Cover Letter Generator

---

# 🔮 Future Improvements

- User Authentication
- Resume Version Management
- Job Application Tracker
- AI Chat Assistant
- Resume PDF Export
- Dashboard Analytics
- Multiple AI Provider Support
- Saved Analysis History

---

# 🌐 Live Demo

**Frontend**

https://ai-job-hunter-phi.vercel.app/

---

# 👨‍💻 Author

**Swayam Mahindrakar**

- LinkedIn: https://www.linkedin.com/in/swayam-mahindrakar-82539b314/
- GitHub: https://github.com/Swayam100805

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
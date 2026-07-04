# AI Job Hunter 🚀

AI Job Hunter is a full-stack web application that helps job seekers improve their chances of landing interviews using AI. It provides personalized feedback on resumes, LinkedIn profiles, portfolios, cover letters, and interview preparation by leveraging Anthropic's Claude models.

Whether you're applying for internships or full-time roles, the goal is to make the application process faster, smarter, and more effective.

---

## ✨ Features

- **Resume Analyzer**
  - Evaluate ATS compatibility
  - Identify missing keywords
  - Improve resume bullet points

- **LinkedIn Profile Review**
  - Analyze profile strength
  - Improve headline and About section
  - Get actionable suggestions

- **Portfolio Review**
  - Review project quality
  - Generate PAR (Problem-Action-Result) interview stories
  - Identify missing skills and improvements

- **Job Match Analysis**
  - Compare your profile against job descriptions
  - Calculate match percentage
  - Highlight strengths and skill gaps

- **Cover Letter Generator**
  - Generate customized cover letters
  - Multiple writing styles and tones
  - Tailored to each job posting

- **Interview Preparation**
  - Generate interview questions
  - Evaluate answers
  - Receive model responses and improvement suggestions

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- Anthropic SDK

### AI Model
- Claude Sonnet

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## 🚀 Getting Started

### Prerequisites

Before running the project, make sure you have:

- Node.js (v18 or above)
- An Anthropic API key

---

### Clone the Repository

```bash
git clone <repository-url>
cd ai-job-hunter
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the **backend** folder:

```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

---

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the **frontend** folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

---

## Run the Application

After both servers are running, open:

```
http://localhost:5173
```

---

## 📁 Project Structure

```
ai-job-hunter/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

## Future Improvements

- Authentication
- Job application tracker
- Resume version management
- PDF export
- Support for multiple AI providers
- User dashboard and analytics

---

## License

This project is open for learning and personal use.

## Author

Built by Swayam Mahindrakar — https://www.linkedin.com/in/swayam-mahindrakar-82539b314/
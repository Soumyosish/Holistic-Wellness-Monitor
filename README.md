# Holistic Wellness Monitor 🧘‍♂️ 

Holistic Wellness Monitor is a comprehensive, full-stack health and fitness tracking application designed to help users monitor their physical well-being through meal logging, workout tracking, sleep analysis, and AI-powered health insights.

---

## Features 🌟

- **Interactive Dashboard:** A centralized hub displaying your health overview, daily macros, recent workouts, and gamification streaks.
- **Nutrition Tracking:** Log your daily food intake with detailed macro breakdowns (Protein, Carbs, Fats) and calorie totals.
- **Workout Logging:** Track your physical activities, set goals, and visualize your progress through interactive charts.
- **Health Metrics:** Monitor vitals like heart rate, blood pressure, and blood sugar with easy-to-use sliders and visual feedback.
- **AI ChatBot:** Integrated Gemini AI assistant to answer your health-related queries and provide personalized wellness tips.
- **Interactive BMI Calculator:** Visualize your Body Mass Index on a dynamic gauge and understand your category immediately.
- **Gamification & Rewards:** Earn badges, track streaks, and collect points for staying consistent with your health goals.
- **Secure Authentication:** Robust JWT-based login, registration with automatic health initialization, and Google OAuth integration.
- **Responsive & Aesthetic Design:** A premium, modern UI featuring glassmorphism, smooth animations, and a responsive layout for all devices.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Recharts (Charts), Lucide React (Icons)
- **Backend:** Node.js, Express, MongoDB (Mongoose), Nodemailer (Email Services)
- **AI Integration:** Google Gemini API
- **Authentication:** JWT, Google OAuth 2.0

---

## Getting Started 🚀

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB Atlas account or local MongoDB installation

### 1. Clone the Repository
```bash
git clone https://github.com/Soumyosish/Holistic-Wellness-Monitor.git
cd "Holistic Wellness Monitor"
```

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder:
   ```env
   MONGODB_URL=your-mongodb-uri
   JWT_SECRET=your_jwt_secret_here
   PORT=8000
   FRONTEND_URL=http://localhost:5173
   JWT_EXPIRES_IN=time_duration
   EMAIL_USER=your_email_username
   EMAIL_PASS=your_email_password
   
   # Optional: Email for Password Reset/Contact
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```
4. Start the backend server:
   ```bash
   node index.js
   ```

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_GEMINI_API_KEY=your-gemini-key
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## Folder Structure 📂

```
Holistic Wellness Monitor/
├── backend/
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers (Auth, Meals, Workouts, etc.)
│   ├── middlewares/        # Auth & Error handling middlewares
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── utils/              # Email services & Health calculators
│   └── index.js            # Entry point
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images & Icons
│   │   ├── components/
│   │   │   ├── layout/     # Navbar, ChatBot, ProtectedRoute
│   │   │   ├── dashboard/  # Widgets & Summary cards
│   │   │   ├── trackers/   # Meal, Water, Sleep, Step trackers
│   │   │   └── common/     # Reusable UI (BMI, Charts)
│   │   ├── contexts/       # Auth state management
│   │   ├── pages/          # Full page views (Dashboard, Profile, Trackers)
│   │   ├── services/       # API integration services
│   │   ├── utils/          # Frontend calculation logic
│   │   ├── App.jsx         # Routing configuration
│   │   └── main.jsx        # Registry
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md               # You are here!
```

---

## Future Enhancements 🌱

- **Personalized AI Meal Plans:** More advanced meal recommendations based on user preferences and goals.
- **Wearable Integration:** Sync with Apple Health and more Google Fit categories.
- **Social Features:** Connect with friends to share progress and challenges.
- **Workout Video Library:** Integrated exercise videos for better workout guidance.

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
[Proprietary] - All Rights Reserved.

---

## Acknowledgements
- Inspired by modern health management and minimal aesthetic design principles.
- Icons by Lucide React.
- Charts by Recharts

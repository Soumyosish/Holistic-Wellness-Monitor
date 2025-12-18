# Holistic Wellness Monitor - Frontend

This is the frontend portion of the Holistic Wellness Monitor, built with React, Vite, and Tailwind CSS.

## Directory Structure

`src/`
- `assets/`: Images and static assets.
- `components/`: Reusable React components.
  - `layout/`: Core UI like Navbar, ChatBot, and ProtectedRoute.
  - `dashboard/`: Widgets specific to the main dashboard view.
  - `trackers/`: Components for logging and visualizing metrics (Meals, Steps, Water, Sleep).
  - `common/`: Generic reusable components like BMICalculator and MacroChart.
- `pages/`: Main application views/routes.
  - `auth/`: Authentication-related pages (Login, Register, etc.).
- `contexts/`: React Contexts (e.g., AuthContext).
- `data/`: Local JSON data files.
- `services/`: API service layers.
- `utils/`: Helper functions and calculators.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file based on `.env.example`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Key Technologies

- **React**: UI library
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Recharts**: Data visualization
- **Lucide React**: Icon set
- **Axios**: HTTP client

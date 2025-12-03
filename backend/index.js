import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();
const app=express();
const PORT=process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Wellness';
app.use(cors({
  origin:process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.urlencoded({extended:"true"}))
app.use(express.json())
mongoose.connect(MONGO_URI,{})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
app.get('/', (req, res) => {
  res.send('Hollistic Wellness Monitor backend is running!');
});
// 404 handler
// app.use((req, res) => {
//   res.status(404).json({ error: 'Not found' });
// });
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
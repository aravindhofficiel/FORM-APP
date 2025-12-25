import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Workouts from "./pages/Workouts";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </BrowserRouter>
  );
}

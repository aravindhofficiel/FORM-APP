import { useNavigate } from "react-router-dom";
import "../Components/css/workouts.css";


export default function Workouts() {
  const navigate = useNavigate();

  return (
    <div className="workouts-page">
      {/* BACK ARROW */}
      <button className="back-btn" onClick={() => navigate("/")}>
        ←
      </button>

      <h1>Workout Library</h1>

      {[...Array(20)].map((_, i) => (
        <div key={i} className="workout-card">
          Workout #{i + 1}
        </div>
      ))}
    </div>
  );
}

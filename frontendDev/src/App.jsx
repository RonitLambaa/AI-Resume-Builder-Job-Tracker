import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import api from "./api/axios";
import { login, logout, setLoading } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return; // skip if no token

    dispatch(setLoading(true));
    try {
      const res = await api.get("/auth/me"); // fetch current user
      dispatch(
        login({ user: res.data.data.user, status: true }) // populate Redux
      );
      console.log("User fetched successfully");
    } catch (err) {
      console.log("Token invalid or expired, skipping logout");
      // optional: you can log out only if token was present but invalid
    } finally {
      dispatch(setLoading(false));
    }
  };

  fetchCurrentUser();
}, [dispatch]);
   

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;



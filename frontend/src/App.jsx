import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import GreetVerification from "./pages/EmailVerification/GreetVerification";
import { Toaster } from "react-hot-toast";
import Verify from "./pages/Verify/Verify";
import Home from "./pages/Home/Home";
import { useStoreContext } from "./store/StoreProvider";
export default function App() {
  const { user } = useStoreContext();
  const { is_auth } = user;
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={is_auth ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!is_auth ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!is_auth ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/greet-email"
          element={!is_auth ? <GreetVerification /> : <Navigate to="/" />}
        />
        <Route
          path="/verify"
          element={!is_auth ? <Verify /> : <Navigate to="/" />}
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

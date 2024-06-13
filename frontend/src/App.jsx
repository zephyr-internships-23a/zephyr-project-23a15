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
import StoreProvider, { useStoreContext } from "./store/StoreProvider";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Profile from "./pages/Profile/Profile";
import BecomeAgent from "./pages/BecomeAgent/BecomeAgent";
import EditProfile from "./pages/Profile/EditProfile";
import Layout from "./components/Admin/Outlet/Layout";
import Application from "./pages/Admin/Application/Application";
import Agents from "./pages/Admin/Application/Agents";
import User from "./pages/Admin/User";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import PropertyDetails from "./pages/PropertyDetails.jsx/PropertyDetails";
import SmartSearch from "./pages/SmartSearch/SmartSearch";
import Chat from "./pages/Chat/Chat";
import Payment from "./pages/Checkout/Payment";
import PaymentSuccess from "./pages/PaymentSuccess/PaymentSuccess";
import Transaction from "./pages/Admin/Transaction";
const client = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={client}>
      <StoreProvider>
        <AppRoutes />
      </StoreProvider>
    </QueryClientProvider>
  );
}

const AppRoutes = () => {
  const { user } = useStoreContext();
  const { is_auth, account_type } = user;
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
        <Route
          path="/forgot-password"
          element={!is_auth ? <ForgetPassword /> : <Navigate to="/" />}
        />
        <Route
          path="/reset-password"
          element={!is_auth ? <ResetPassword /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={is_auth ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/become/agent"
          element={is_auth ? <BecomeAgent /> : <Navigate to="/login" />}
        />
        <Route
          path="/property/:id"
          element={is_auth ? <PropertyDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit/profile"
          element={is_auth ? <EditProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/smart-search"
          element={is_auth ? <SmartSearch /> : <Navigate to="/login" />}
        />
        <Route
          path="/chats"
          element={is_auth ? <Chat /> : <Navigate to="/login" />}
        />
        <Route
          path="/checkout"
          element={is_auth ? <Payment /> : <Navigate to="/login" />}
        />
        <Route
          path="/payment-success"
          element={is_auth ? <PaymentSuccess /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={account_type == "admin" ? <Layout /> : <Navigate to="/" />}
        >
          <Route path="/admin/application" element={<Application />} />
          <Route path="/admin/users" element={<User />} />
          <Route path="/admin/agents" element={<Agents />} />
          <Route path="/admin/transactions" element={<Transaction />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
};

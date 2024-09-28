import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import SeatSelection from "./pages/seatSelection";
import ConfirmTicket from "./pages/confirmTicket";
import Payment from "./pages/payment";
import Success from "./pages/success";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seatselection" element={<SeatSelection />} />
        <Route path="/confirmTicket" element={<ConfirmTicket />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;

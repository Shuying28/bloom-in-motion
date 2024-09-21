import React, { useState } from "react";
import "./styles/confirmTicket.css";
import { useNavigate } from "react-router-dom";

interface ConfirmTicketProps {
  seats: string[];
  totalPrice: number;
}

const ConfirmTicket: React.FC<ConfirmTicketProps> = ({ seats, totalPrice }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const handlePaymentSelection = (method: string) => {
    setPaymentMethod(method);
  };

  return (
    <div className="confirm-ticket">
      <h2>Confirm Ticket</h2>
      <div className="seat-info">
        <h3>Seats(s)</h3>
        <p>{seats.join(", ")}</p>
      </div>
      <div className="price-info">
        <h3>Total Price</h3>
        <p>RM {totalPrice}</p>
      </div>
      <div className="payment-options">
        <label>
          <input
            type="radio"
            name="paymentMethod"
            checked={paymentMethod === "bankTransfer"}
            onChange={() => handlePaymentSelection("bankTransfer")}
          />
          Bank Transfer
          <div className="bank-info">
            <p>Loie Xin Tung</p>
            <p>1648 5618 2039</p>
            <img src="path/to/bank-qr-code.png" alt="Bank QR Code" />
          </div>
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            checked={paymentMethod === "tng"}
            onChange={() => handlePaymentSelection("tng")}
          />
          Touch 'n Go eWallet
          <div className="tng-info">
            <p>Ngo Yun Shuang</p>
            <p>+6019-775 5905</p>
            <img src="path/to/tng-qr-code.png" alt="TnG QR Code" />
          </div>
        </label>
      </div>
      <button className="next-button" onClick={() => navigate("/payment")}>
        Next
      </button>
    </div>
  );
};

export default ConfirmTicket;

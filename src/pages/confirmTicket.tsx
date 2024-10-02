import React, { useEffect, useState } from "react";
import "./styles/confirmTicket.css";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/common.css";

const ConfirmTicket: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSeats, totalPrice } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [checked, setChecked] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    // Retrieve checked state and payment method from session storage
    const storedChecked = sessionStorage.getItem("termsAccepted");
    const storedPaymentMethod = sessionStorage.getItem("paymentMethod");

    if (storedChecked) {
      setChecked(JSON.parse(storedChecked));
    }

    if (storedPaymentMethod) {
      setPaymentMethod(storedPaymentMethod);
    }
  }, []);

  useEffect(() => {
    if (checked && paymentMethod) {
      setConfirm(true);
    }
  }, [checked, paymentMethod]);

  const handleCheckboxChange = () => {
    setChecked(!checked);
    sessionStorage.setItem("termsAccepted", JSON.stringify(!checked));
  };

  const handlePaymentSelection = (method: string) => {
    setPaymentMethod(method);
    sessionStorage.setItem("paymentMethod", JSON.stringify(method));
  };

  return (
    <div className="confirm-ticket-page">
      <h2>Confirm Ticket</h2>
      <div className="ticket-info">
        <h3 className="info-title">Seats(s)</h3>
        <p className="p">{selectedSeats.join(", ")}</p>
      </div>
      <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
      <div className="ticket-info">
        <h3>Total Price</h3>
        <p className="p">RM {totalPrice}</p>
      </div>
      <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
      <div className="payment-options">
        <h3>Payment Option</h3>
        <label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "Bank Transfer"}
              onChange={() => handlePaymentSelection("Bank Transfer")}
              className="custom-radio"
            />
            <span style={{ marginTop: "3px" }}>Bank Transfer</span>
          </div>
          <div className="bank-info">
            <p>Loie Xin Tung</p>
            <p>1648 5618 2039</p>
            <p className="payment-info">
              *Please remark your payment reference as "XMUM Dance Concert"
            </p>
            <img
              src={require("../assets/maybank_qr.jpeg")} // Replace with actual logo path
              alt="Bank QR Code"
            />
          </div>
        </label>
        <label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "Touch 'n Go eWallet"}
              onChange={() => handlePaymentSelection("Touch 'n Go eWallet")}
              className="custom-radio"
            />
            <span style={{ marginTop: "3px" }}>Touch 'n Go eWallet</span>
          </div>
          <div className="tng-info">
            <p>Ngo Yun Shuang</p>
            <p>+6019-775 5905</p>
            <p className="payment-info">
              *Please remark your payment reference as "XMUM Dance Concert"
            </p>
            <img src={require("../assets/tng_qr.jpeg")} alt="TnG QR Code" />
          </div>
        </label>
      </div>

      <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />

      <div>
        <h3>Terms & Condition</h3>
        <ol>
          <li>
            All ticket sales are final. Tickets are non-refundable and cannot be
            canceled once purchased.
          </li>
          <li>
            Ensure the payment amount matches the total displayed after seat
            selection. Any incorrect transfers will not be refunded.
          </li>
          <li>
            Upon successful payment, a confirmation email will be sent to the
            provided email address. Please ensure your contact details are
            accurate.
          </li>
          <li>
            Present your confirmation email at the ticket redemption booth to
            collect your physical ticket.
          </li>
          <li>
            The exact ticket redemption date will be announced on our official
            Instagram page.
          </li>
          <li>A valid ticket is required for entry to the venue.</li>
          <li>
            Attendees are required to behave respectfully and adhere to all
            venue rules and regulations. We reserve the right to refuse entry or
            remove anyone in violation of these policies, without refund.
          </li>
          <li>
            XMUM Dance Club reserves the right to amend the Terms and Conditions
            at any time.
          </li>
          <li>
            For inquiries, please contact Michelle (+60 1111793783) or Beverly
            (+60 135333198).
          </li>
        </ol>
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="t-and-c"
            checked={checked}
            onChange={handleCheckboxChange}
            className="checkbox"
          />
          <label htmlFor="t-and-c" className="checkbox-label">
            I have read and understood all the T&Cs.
          </label>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          className={`next-button ${confirm ? "active" : "disabled"}`}
          disabled={!confirm}
          onClick={() =>
            navigate("/payment", {
              state: {
                selectedSeats,
                totalPrice,
                paymentMethod,
              },
            })
          }
        >
          <span>Next</span>
        </button>
      </div>
    </div>
  );
};

export default ConfirmTicket;

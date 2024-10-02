import React, { useEffect } from "react";
import { Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircleOutlined } from "@ant-design/icons";
import "./styles/success.css";
import "./styles/common.css";

const Success: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, selectedSeats, totalPrice, paymentMethod } =
    location.state || {};

  return (
    <div className="success-page">
      <div className="icon-container">
        <CheckCircleOutlined className="check-icon" />
      </div>
      <h2 className="success-title">You’re All Set!</h2>
      <p className="success-info">
        Thanks for purchasing the ticket from us :)
      </p>

      <hr style={{ width: "100%", border: "1px solid #b8b8b8", margin: "16px 0" }} />

      <div className="details-container">
        <p>
          <strong>Name:</strong> {formData?.name}
        </p>
        <p>
          <strong>Student ID:</strong> {formData?.studentID}
        </p>
        <p>
          <strong>Selected Seats:</strong> {selectedSeats?.join(", ")}
        </p>
        <p>
          <strong>Total Price:</strong> RM{totalPrice}
        </p>
        <p>
          <strong>Payment Method:</strong> {paymentMethod}
        </p>
      </div>

      <p className="redemption-info">
        Tickets can be redeemed either at our designated booth prior to the
        event or on the event day itself. Stay tuned for updates on our official
        Instagram page @xmumdc_concert.
      </p>

      <Button
        type="primary"
        shape="round"
        size="large"
        className="home-button"
        onClick={() => navigate("/")}
      >
        <span>Back To Home</span>
      </Button>
      <p className="ss">
        Please take a screenshot of this page and keep it as a record before
        returning to the home page.
      </p>
    </div>
  );
};

export default Success;

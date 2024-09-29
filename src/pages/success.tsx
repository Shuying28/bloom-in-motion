import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { CheckCircleOutlined } from "@ant-design/icons";
import "./styles/success.css";

const Success: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="success-page">
      <div className="icon-container">
        <CheckCircleOutlined className="check-icon" />
      </div>
      <h2 className="success-title">You’re All Set!</h2>
      <p className="success-info">Thanks for purchasing the ticket from us :)</p>
      <Button
        type="primary"
        shape="round"
        size="large"
        className="home-button"
        onClick={() => navigate("/")}
      >
        Back To Home
      </Button>
    </div>
  );
};

export default Success;

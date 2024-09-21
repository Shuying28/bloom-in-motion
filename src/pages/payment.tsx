import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Payment: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>payment</h1>
      <Button
        type="primary"
        shape="round"
        size="large"
        onClick={() => navigate("/success")}
      >
        Confirm
      </Button>
    </div>
  );
};

export default Payment;

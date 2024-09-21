import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Success: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Success</h1>
      <Button
        type="primary"
        shape="round"
        size="large"
        onClick={() => navigate("/")}
      >
        Back To Home
      </Button>
    </div>
  );
};

export default Success;

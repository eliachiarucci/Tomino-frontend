import { Button } from "antd";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <Link to="/login">
      <Button type="primary">CIAO</Button>
    </Link>
  );
};

export default HomePage;

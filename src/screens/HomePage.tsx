import { Button, Typography } from "antd";
import { Link } from "react-router-dom";
import Tomino from "../components/Tomino/Tomino";
import FlexContainer from "flexcontainer-react";
import Ellipse from "../ellipse.png";
import "../App.less";
import "./HomePage.module.css";
import { LoginOutlined } from "@ant-design/icons";
import { url } from "inspector";
const { Title } = Typography;

export const HomePage = () => {
  return (
    <>
      <FlexContainer
        className="background"
        style={{ backgroundImage: "url(" + Ellipse + ")" }}
        type="horizontal"
        alignItems="center"
        width="100%"
        justifyContent="center"
      >
        <FlexContainer
          className="homepage-hero"
          type="horizontal"
          alignItems="center"
          width="700px"
          justifyContent="space-between"
        >
          <FlexContainer type="vertical" width="600px" gap={0}>
            <Title>Hi, I'm Tomino!</Title>
            <Title level={3}>Let's start cooking together!</Title>
            <FlexContainer width="100%">
              <Link to="/login" style={{ marginTop: "20px" }}>
                <Button size="large" type="primary" icon={<LoginOutlined />}>
                  Login
                </Button>
              </Link>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer width="500px" height="500px">
            <Tomino standalone={false} />
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default HomePage;

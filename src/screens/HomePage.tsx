import { Button, Typography } from "antd";
import { Link } from "react-router-dom";
import Tomino from "../components/Tomino/Tomino";
import FlexContainer from "flexcontainer-react";
import Ellipse from "../images/ellipse.png";
import EllipseRotated from "../images/ellipseRotated.png";
import "../App.less";
import styles from "./HomePage.module.css";
import Logo from "../TominoLogo.png";
import { LoginOutlined } from "@ant-design/icons";
import { url } from "inspector";
import { isAbsolute } from "path";
const { Title, Text } = Typography;

export const HomePage = () => {
  console.log(styles);
  return (
    <div className={styles.homepageContainer}>
      <FlexContainer
        className="background"
        style={{ backgroundImage: "url(" + Ellipse + ")" }}
        type="horizontal"
        alignItems="center"
        width="100%"
        justifyContent="center"
      >
        <FlexContainer type="horizontal" alignItems="center" width="700px" justifyContent="space-between">
          <FlexContainer type="vertical" width="600px" gap={0}>
            <Title className={styles.white}>Hi, I'm Tomino!</Title>
            <Title className={styles.white} level={3}>
              Let's start cooking together!
            </Title>
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
      <div className={styles.stepWrapper}>
        <FlexContainer
          type="horizontal"
          justifyContent="space-around"
          alignItems="flex-start"
          alignSelf="flex-start"
          width="80%"
          style={{ maxWidth: "1000px", marginTop: "70px" }}
        >
          <div className={styles.stepContainer}>
            <div
              className={styles.roundedImage}
              style={{ backgroundImage: "url(https://media.giphy.com/media/l2JdXdevzyj8lfexO/giphy.gif)" }}
            ></div>
            <Title level={3}>Step 1</Title>
            <Text>Find a recipe that you like, use my magical filters to find the perfect food to cook</Text>
          </div>
          <div className={styles.stepContainer}>
            <div
              className={styles.roundedImage}
              style={{ backgroundImage: "url(https://media.giphy.com/media/EDV30lQQ9VW5q/giphy.gif)" }}
            ></div>
            <Title level={3}>Step 2</Title>
            <Text>Prepare every ingredient and get ready!</Text>
          </div>
          <div className={styles.stepContainer}>
            <div
              className={styles.roundedImage}
              style={{ backgroundImage: "url(https://media.giphy.com/media/4gdveTpNzr9ok/giphy.gif)" }}
            ></div>
            <Title level={3}>Step 3</Title>
            <Text>Leave the device near to you, I will do my best to make you easily follow the recipe</Text>
          </div>
        </FlexContainer>
      </div>
      <div className={styles.footer} style={{ backgroundImage: "url(" + EllipseRotated + ")" }}>
        <Text> @2020 Elia Chiarucci </Text>
      </div>
    </div>
  );
};

export default HomePage;

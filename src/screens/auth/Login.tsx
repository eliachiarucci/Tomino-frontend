import React, { useState } from "react";
import { Form, Input, Checkbox, Button, Upload, Typography, message } from "antd";
import { UserOutlined, LockOutlined, UploadOutlined } from "@ant-design/icons";
import Axios from "axios";
import AuthService from "../../services/auth-service.js";
import FlexContainer from "flexcontainer-react";
import styles from "./auth.module.css";
import { Link } from "react-router-dom";

const { Title } = Typography;

interface loginValues {
  username: string;
  email: string;
  password: string;
}

interface props {
  getUser: Function;
}

const Login = ({ getUser }: props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const authService = new AuthService();

  const onFinish = (values: loginValues) => {
    console.log("Received values of form: ", values);
    authService
      .login(values.email, values.password)
      .then(data => getUser(data))
      .catch(err => {
        message.error(err.response.data.message);
      });
  };

  return (
    <FlexContainer type="horizontal" alignItems="center" justifyContent="center" width="100%" height="700px">
      <FlexContainer type="horizontal" className={styles.signupCard} gap={0}>
        <FlexContainer type="vertical" padding={50}>
          <Title>Log In</Title>
          <div className={styles.loginFormWrap}>
            <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={onFinish}>
              <Form.Item name="email" rules={[{ required: true, message: "Please input your Email!" }]}>
                <Input prefix={<UserOutlined className="site-form-item-icon" />} type="email" placeholder="Email" />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
                <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Button className={styles.wideButton} type="primary" htmlType="submit">
                  Log in
                </Button>
              </Form.Item>
              Or <Link to="/signup">register now!</Link>
            </Form>
          </div>
        </FlexContainer>
        <FlexContainer type="vertical" height="100%" width="500px">
          <div className={styles.image} style={{ backgroundImage: 'url("https://media.giphy.com/media/L2kz4V3Mr7QyY/giphy.gif")' }} />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default Login;

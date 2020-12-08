import React, { useState } from "react";
import { Form, Input, Checkbox, Button, Upload } from "antd";
import { UserOutlined, LockOutlined, UploadOutlined } from "@ant-design/icons";
import Axios from "axios";
import AuthService from "../../services/auth-service.js";

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
      .then((data) => getUser(data))
      .catch((err) => {
        const { message } = err.response.data;
        setErrorMessage(message);
      });
  };

  return (
    <>
      <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item name="email" rules={[{ required: true, message: "Please input your Email!" }]}>
          <Input prefix={<UserOutlined className="site-form-item-icon" />} type="email" placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
          <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
      {errorMessage}
    </>
  );
};

export default Login;

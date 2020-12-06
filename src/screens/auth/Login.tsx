import React, { useState } from "react";
import { Form, Input, Checkbox, Button, Upload } from "antd";
import { UserOutlined, LockOutlined, UploadOutlined } from "@ant-design/icons";
import Axios from "axios";
import AuthService from "../../services/auth-service.js";

interface loginValues {
  username: string;
  password: string;
}

interface props {
  getUser: Function;
}

const Login = ({ getUser }: props) => {
  const authService = new AuthService();

  const onFinish = (values: loginValues) => {
    console.log("Received values of form: ", values);
    authService
      .login(values.username, values.password)
      .then((data) => getUser(data));
  };

  const normFile = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
          name="upload"
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;

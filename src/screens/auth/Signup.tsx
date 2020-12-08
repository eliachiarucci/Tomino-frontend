import React, { useState } from "react";
import { Form, Input, Checkbox, Button, Upload, Typography } from "antd";
import { MailOutlined, UserOutlined, LockOutlined, UploadOutlined } from "@ant-design/icons";
import Axios from "axios";
import AuthService from "../../services/auth-service.js";
import env from "../../env";
import FlexContainer from "flexcontainer-react";
import { useHistory } from "react-router-dom";
const { Title, Text, Link } = Typography;

interface signupValues {
  username: string;
  password: string;
  email: string;
  image: any;
}

const Signup = () => {
  const authService = new AuthService();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const history = useHistory();

  const normFile = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    if (e.fileList.length > 1) {
      e.fileList.shift();
    }
    return e && e.fileList;
  };

  const onFinish = (values: signupValues) => {
    console.log("Received values of form: ", values);
    authService
      .signup(values.username, values.email, values.password, values.image[0].response.cloudinaryUrl)
      .then((data) => {
        history.push("/login");
      })
      .catch((err) => {
        const { message } = err.response.data;
        setErrorMessage(message);
      });
  };

  const uploadUrl = () => {
    return env.SERVER_URL + "/upload";
  };

  return (
    <FlexContainer type="vertical" alignItems="center" justifyContent="center" width="100%" height="50%">
      <Title>Sign Up:</Title>
      <Form name="signup" className="auth_form" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item name="username" rules={[{ required: true, message: "Please input your Username!" }]}>
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item name="email" rules={[{ type: "email", required: true, message: "Please input your Email!" }]}>
          <Input prefix={<MailOutlined className="site-form-item-icon" />} type="email" placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
          <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image"
          valuePropName="file"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Please upload a profile picture!" }]}
        >
          <Upload accept=".jpg, .jpeg, .png" multiple={false} name="image" action={uploadUrl} listType="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="form-button">
            Sign Up
          </Button>
          <br></br>
          If you already have an account, <a href="">Login</a>
        </Form.Item>
        <Text type="danger">{errorMessage}</Text>
      </Form>
    </FlexContainer>
  );
};

export default Signup;

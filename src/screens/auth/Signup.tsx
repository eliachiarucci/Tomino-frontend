import React, { useState } from "react";
import { Form, Input, Checkbox, Button, Upload, Typography, message, Image } from "antd";
import { MailOutlined, UserOutlined, LockOutlined, UploadOutlined } from "@ant-design/icons";
import Axios from "axios";
import AuthService from "../../services/auth-service.js";
import env from "../../env";
import styles from "./auth.module.css";
import FlexContainer from "flexcontainer-react";
import { useHistory, Link } from "react-router-dom";
const { Title, Text } = Typography;

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
      .then(data => {
        history.push("/login");
      })
      .catch(err => {
        message.error(err.response.data.message);
      });
  };

  const uploadUrl = () => {
    return env.SERVER_URL + "/upload";
  };

  return (
    <FlexContainer type="horizontal" alignItems="center" justifyContent="center" width="100%" height="700px">
      <FlexContainer type="horizontal" className={styles.signupCard} gap={0}>
        <FlexContainer type="vertical" padding={50}>
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
              <Upload accept=".jpg, .jpeg, .png" multiple={false} name="image" action={uploadUrl} listType="text">
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button className={styles.wideButton} type="primary" htmlType="submit">
                Sign Up
              </Button>
              <br />
              If you already have an account, <Link to="/login">Login</Link>
            </Form.Item>
            <Text type="danger">{errorMessage}</Text>
          </Form>
        </FlexContainer>
        <FlexContainer type="vertical" height="100%" width="500px">
          <div className={styles.image} style={{ backgroundImage: 'url("https://media.giphy.com/media/jhFUy6eCy6xs4/giphy.gif")' }} />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default Signup;

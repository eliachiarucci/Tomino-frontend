import React from "react";
import { Button } from "antd";
import authService from "../../services/auth-service";
import { Link } from "react-router-dom";

interface props {
  user: string;
  getUser: Function;
  loggedInUser: Object;
}

const UserPage = ({ user, getUser, loggedInUser }: props) => {
  const AuthService = new authService();

  const logout = () => {
    AuthService.logout().then(() => getUser(null));
  };

  return (
    <div>
      <Link to="/">
        <Button type="primary" onClick={logout}>
          Logout
        </Button>
      </Link>
    </div>
  );
};

export default UserPage;

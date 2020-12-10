import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from 'antd';
import styles from "./NavBar.module.css";
import FlexContainer from 'flexcontainer-react';
import AuthService from "../../services/auth-service";
import Logo from '../../TominoLogo.png';
const {Title, Text} = Typography;
const Navbar = (props) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const service = new AuthService();
  // Mimic lifecycle method when a component updates
  useEffect(() => {
    setLoggedInUser(props.userInSession);
  }, [props.userInSession]);

  // function to log user out
  const logout = () => {
    service.logout().then(() => {
      // reset state value
      setLoggedInUser(null);

      // reset getUser value
      props.getUser(null);
    });
  };

  console.log(styles);

    return (
      <nav class={styles.navbar}>
        <FlexContainer type="horizontal" justifyContent="space-between" height="100%" alignItems="center" padding="0px 30px">
          <FlexContainer height="100%" alignItems="center">
            <img className={styles.logo} src={Logo}></img>
          </FlexContainer>
            {loggedInUser ? (
              <FlexContainer type="horizontal" height="100%" alignItems="center" gap={20}>
                <img src={props.userInSession.image} className={styles.img}></img>
                <Title className={styles.title} level={4}>{props.userInSession.username || ""}</Title>
                <Link to="/home"><Button type="primary">Home</Button></Link>
                <Link to="/profile"><Button type="primary">Profile</Button></Link>
                <Button type="primary" onClick={logout}>Logout</Button>
              </FlexContainer>
            ) : 
              (<FlexContainer type="horizontal" height="100%" alignItems="center" gap={20}>
                <Link to="/"><Button type="primary">Home</Button></Link>
                <Link to="/signup"><Button type="primary">SignUp</Button></Link>
                <Link to="/login"><Button type="primary">Login</Button></Link>
              </FlexContainer> ) 
            }
        </FlexContainer>
      </nav>
    )
      
};

export default Navbar;
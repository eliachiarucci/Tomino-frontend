import React, { useEffect, useState } from "react";
import authService from "../../services/auth-service";
import { Link } from "react-router-dom";
import recipeService from "../../services/recipe-service";
import { Button, Card, Avatar } from "antd";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";

const { Meta } = Card;

interface props {
  user: string;
  getUser: Function;
  loggedInUser: Object;
}

const UserPage = ({ user, getUser, loggedInUser }: props) => {
  const AuthService = new authService();
  const RecipeService = new recipeService();
  const [recipes, setRecipes] = useState<any>([]);

  const logout = () => {
    AuthService.logout().then(() => getUser(null));
  };

  useEffect(() => {
    RecipeService.getRecipes().then((data) => {
      setRecipes(data);
    });
  }, []);

  useEffect(() => {
    console.log(recipes);
  }, [recipes]);

  return (
    <>
      <div>
        <Link to="/">
          <Button type="primary" onClick={logout}>
            Logout
          </Button>
        </Link>
      </div>
      {recipes.map((recipe: any) => (
        <Card
          style={{ width: 300 }}
          cover={<img alt="example" src={recipe.image} />}
          actions={[
            <SettingOutlined key="setting" />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Meta
            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
            title={recipe.title}
            description={recipe.description}
          />
        </Card>
      ))}
    </>
  );
};

export default UserPage;

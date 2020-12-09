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

  const openRecipe = () => {};

  useEffect(() => {
    console.log(recipes);
    console.log(window.performance);
  }, [recipes]);

  return (
    <>
      {recipes.map((recipe: any) => (
        <Card
          key={recipe._id}
          style={{ width: 300 }}
          cover={<img alt="example" src={recipe.image} />}
          actions={[<Link to={`/recipe/${recipe._id}`}>OPEN</Link>]}
        >
          <Meta avatar={<Avatar src={recipe.author.image} />} title={recipe.title} description={recipe.description} />
        </Card>
      ))}
    </>
  );
};

export default UserPage;

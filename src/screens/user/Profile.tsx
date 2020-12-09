import React, { useEffect, useState } from "react";
import recipeService from "../../services/recipe-service";
import { Button, Spin } from "antd";
import { Link } from "react-router-dom";

const Profile = () => {
  const RecipeService = new recipeService();
  const [recipes, setRecipes] = useState<any>();

  useEffect(() => {
    RecipeService.getMyRecipes()
      .then((data) => setRecipes(data))
      .catch((err) => console.log(err.response.message));
  }, []);

  const modifyRecipe = () => {};

  const deleteRecipe = (recipeID: string) => {
    RecipeService.deleteRecipe(recipeID)
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));
  };

  return recipes ? (
    <div>
      {recipes.map((recipe: any) => (
        <>
          <div key={recipe.key}>{recipe.title}</div>
          <Link to={`/recipe/modify/${recipe._id}`}>
            <Button>Modify</Button>
          </Link>
          <Button onClick={() => deleteRecipe(recipe._id)}>Delete</Button>
        </>
      ))}
    </div>
  ) : (
    <Spin></Spin>
  );
};

export default Profile;

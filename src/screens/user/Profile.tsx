import React, { useEffect, useState } from "react";
import recipeService from "../../services/recipe-service";
import { Row, Button, Spin, Col, Card, Form, Select, Image, Rate, Avatar, Typography } from "antd";
import { Link } from "react-router-dom";
import styles from "./user.module.css";
const { Title } = Typography;
const { Meta } = Card;

const Profile = () => {
  const RecipeService = new recipeService();
  const [recipes, setRecipes] = useState<any>();

  useEffect(() => {
    RecipeService.getMyRecipes()
      .then((data) => setRecipes(data))
      .catch((err) => console.log(err.response.message));
  }, []);

  const deleteRecipe = (recipeID: string) => {
    RecipeService.deleteRecipe(recipeID)
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
  };

  const returnFormattedTitle = (title: string) => {
    if (title.length > 15) return title.substr(0, 15) + "...";
    console.log(title);
    return title;
  };

  const returnFormattedDescription = (description: string) => {
    if (description.length > 65) return description.substr(0, 65) + "...";
    return description;
  };

  const getRecipeIngredientsOptions = (ingredients: any) => {
    console.log(ingredients);
    let wordCount = 0;
    const ingredientsArray: any = [];
    ingredients.forEach((ingredient: any) => {
      wordCount += ingredient.name.length;
      if (wordCount < 30) ingredientsArray.push(ingredient.name);
    });
    return ingredientsArray;
  };

  return recipes ? (
    <div>
      <Title>My Recipes</Title>
      <Row gutter={[40, 40]}>
        {recipes.map((recipe: any) => (
          <Col key={recipe._id}>
            <Card
              className={styles.miniCard}
              cover={<Image className={styles.cardImage} alt="example" src={recipe.image} />}
              actions={[
                <Link to={`/recipe/modify/${recipe._id}`}>
                  <Button>Modify</Button>
                </Link>,
                <Button onClick={() => deleteRecipe(recipe._id)}>Delete</Button>,
              ]}
            >
              <Meta
                avatar={<Avatar src={recipe.author.image} />}
                title={returnFormattedTitle(recipe.title)}
                description={<div className={styles.cardDescription}>{returnFormattedDescription(recipe.description)}</div>}
              />
              <Form {...layout}>
                <Form.Item label="Ingredients">
                  <Select
                    defaultValue={getRecipeIngredientsOptions(recipe.ingredients)}
                    mode="tags"
                    style={{ width: "100%" }}
                    placeholder="Ingredients"
                    disabled
                  ></Select>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  ) : (
    <Spin></Spin>
  );
};

export default Profile;

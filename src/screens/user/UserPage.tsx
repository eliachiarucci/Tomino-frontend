import React, { useEffect, useState } from "react";
import authService from "../../services/auth-service";
import { Link } from "react-router-dom";
import recipeService from "../../services/recipe-service";
import { Select, Rate, Input, InputNumber, Form, Button, Card, Avatar, Row, Col, Image, Typography, Divider } from "antd";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import FlexContainer from "flexcontainer-react";
import styles from "./user.module.css";
import timeFormatter from "../../helpers/timeFormatter";

const { Option } = Select;
const { Title, Text } = Typography;
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
  const [filters, setFilters] = useState<any>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any>([]);

  useEffect(() => {
    RecipeService.getRecipes().then(data => {
      setRecipes(data);
      setFilteredRecipes(data);
    });
  }, []);

  /*   useEffect(() => {
    const filteredRecipes = recipes.filter((recipe: any) => {
      let toReturn = true;
      for (let key in filters) {
        switch (key) {
          case "name":
            if (!recipe.name.contains(filters[key])) toReturn = false;
            break;
          case "author":
            if (!recipe.author.contains(filters[key])) toReturn = false;
            break;
          case "conservationtime":
            if (recipe.conservationtime < filters[key]) toReturn = false;
            break;
          case "calories":
            if (recipe.calories > filters[key]) toReturn = false;
            break;
        }
      }
      return toReturn;
    });
  }, [filters]); */

  const onChange = (value: any, filters: any) => {
    const filterRecipes = recipes.filter((recipe: any) => {
      let toReturn = true;
      console.log(filters);
      for (let key in filters) {
        switch (key) {
          case "name":
            if (recipe.title.toLowerCase().search(filters[key].toLowerCase()) < 0) toReturn = false;
            break;
          case "author":
            if (recipe.author.username.toLowerCase().search(filters[key].toLowerCase()) < 0) toReturn = false;
            break;
          case "conservationtime":
            if (recipe.conservationtime < parseInt(filters[key])) toReturn = false;
            break;
          case "calories":
            if (recipe.calories > parseInt(filters[key])) toReturn = false;
            break;
          case "difficulty":
            if (recipe.difficulty > parseInt(filters[key])) toReturn = false;
            break;
          case "category":
            if (recipe.category !== filters[key] && filters[key] !== "All" && filters[key] !== undefined) toReturn = false;
            break;
        }
      }
      return toReturn;
    });
    setFilteredRecipes(filterRecipes);
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 }
  };

  const filtersLayout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12 }
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

  const getPreparationTime = (time: number) => {
    return new timeFormatter().getFullString(time);
  };

  const categoriesArray = [
    "All",
    "Dessert",
    "Meat",
    "Pasta",
    "Pizza",
    "Vegetarian",
    "Vegan",
    "Appetizer",
    "Fish",
    "Bread",
    "Gluten-free",
    "Other"
  ];

  return (
    <FlexContainer type="horizontal" height="100%">
      <Link to="newrecipe">
        <Button type="primary" className={styles.plusButton}>
          +
        </Button>
      </Link>
      <FlexContainer
        className={styles.sidebar}
        alignItems="center"
        type="vertical"
        minWidth="250px"
        width="250px"
        height="100%"
        padding={20}
      >
        <Title>Filters</Title>
        <Form {...filtersLayout} className="sidebar-form" name="nest-messages" onValuesChange={onChange}>
          <Form.Item name={["name"]} initialValue="" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name={["author"]} initialValue="" label="Author">
            <Input />
          </Form.Item>
          <Form.Item name={["conservationtime"]} label="Conservation">
            <Input type="number" min={0} max={60} />
          </Form.Item>
          <Form.Item name={["calories"]} label="Max Calories">
            <Input type="number" min={0} max={2000} />
          </Form.Item>
          <Form.Item name={["difficulty"]} label="Difficulty">
            <Input type="number" min={0} max={5} />
          </Form.Item>
          <Form.Item name={["category"]} label="Category">
            <Select showSearch placeholder="Select a category" optionFilterProp="children" defaultValue={"All"}>
              {categoriesArray.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
        <Divider />
        <Text>Found {filteredRecipes.length} recipes</Text>
      </FlexContainer>
      <Row gutter={[60, 60]} className={styles.row}>
        {filteredRecipes.map((recipe: any) => (
          <Col key={recipe._id}>
            <Card
              className={styles.card}
              cover={<Image className={styles.cardImage} alt="example" src={recipe.image} />}
              actions={[<Link to={`/recipe/${recipe._id}`}>OPEN</Link>]}
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
                  />
                </Form.Item>

                <Form.Item label="Difficulty">
                  <Rate value={recipe.difficulty} disabled />
                </Form.Item>

                <Form.Item label="Preparation">{getPreparationTime(recipe.preparationtime)}</Form.Item>

                <Form.Item label="Category">{recipe.category}</Form.Item>
              </Form>
            </Card>
          </Col>
        ))}
      </Row>
    </FlexContainer>
  );
};

export default UserPage;

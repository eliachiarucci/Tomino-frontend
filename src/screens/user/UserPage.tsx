import React, { useEffect, useState } from "react";
import authService from "../../services/auth-service";
import { Link } from "react-router-dom";
import recipeService from "../../services/recipe-service";
import { Input, InputNumber, Form, Button, Card, Avatar, Row, Col } from "antd";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import FlexContainer from "flexcontainer-react";

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
    RecipeService.getRecipes().then((data) => {
      setRecipes(data);
      setFilteredRecipes(data);
    });
  }, []);

  useEffect(() => {
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
            if (!recipe.conservationtime.contains(filters[key])) toReturn = false;
            break;
          case "calories":
            if (!recipe.calories.contains(filters[key])) toReturn = false;
            break;
        }
      }
      return toReturn;
    });
  }, [filters]);

  const onChange = (value: any, filters: any) => {
    const filterRecipes = recipes.filter((recipe: any) => {
      let toReturn = true;
      for (let key in filters) {
        switch (key) {
          case "name":
            if (recipe.title.toLowerCase().search(filters[key].toLowerCase()) < 0) toReturn = false;
            break;
          case "author":
            if (recipe.author.username.toLowerCase().search(filters[key].toLowerCase()) < 0) toReturn = false;
            break;
          case "conservationtime":
            if (recipe.conservationtime < filters[key]) toReturn = false;
            break;
          case "calories":
            if (recipe.calories < filters[key]) toReturn = false;
            break;
        }
      }
      return toReturn;
    });
    setFilteredRecipes(filterRecipes);
  };

  return (
    <FlexContainer type="horizontal" height="100%">
      <FlexContainer className="sidebar" type="vertical" width="250px" height="100%">
        <Form className="sidebar-form" name="nest-messages" onValuesChange={onChange}>
          <Form.Item name={["name"]} initialValue="" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name={["author"]} initialValue="" label="Author">
            <Input />
          </Form.Item>
          <Form.Item name={["conservationtime"]} label="Conservation Time">
            <InputNumber type="number" min={0} max={60} />
          </Form.Item>
          <Form.Item name={["calories"]} label="Max Calories">
            <InputNumber type="number" min={0} max={2000} />
          </Form.Item>
          <Form.Item name={["difficulty"]} label="Difficulty">
            <InputNumber type="number" min={0} max={5} />
          </Form.Item>
          <Form.Item name={["rating"]} label="Rating">
            <InputNumber type="number" min={0} max={5} />
          </Form.Item>
        </Form>
      </FlexContainer>
      <Row>
        {filteredRecipes.map((recipe: any) => (
          <Col>
            <Card
              key={recipe._id}
              style={{ width: 300 }}
              cover={<img alt="example" src={recipe.image} />}
              actions={[<Link to={`/recipe/${recipe._id}`}>OPEN</Link>]}
            >
              <Meta
                avatar={<Avatar src={recipe.author.image} />}
                title={recipe.title}
                description={recipe.description}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </FlexContainer>
  );
};

export default UserPage;

  import axios from "axios";
import env from "../env";

// Contains all the methods and also we need to use the create method of axios to build a new instance
class RecipeService {
  constructor() {
    this.service = axios.create({
      baseURL: env.SERVER_URL,
      withCredentials: true, // indicates whether or not cross-site Access-Control requests should be made using credentials
    });
  }

  // Method to use in our SignUp component
  addRecipe = (data) => {
    return this.service
      .post("/recipe/add", data)
      .then(response => response.data)
  };

  getRecipes = () => {
      return this.service
        .get("/recipes")
        .then(response => response.data)
  }

}

export default RecipeService;
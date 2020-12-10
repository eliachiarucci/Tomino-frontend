  
import axios from "axios";
import env from "../env";

// Contains all the methods and also we need to use the create method of axios to build a new instance
class AuthService {
  constructor() {
    this.service = axios.create({
      baseURL: env.SERVER_URL,
      withCredentials: true, // indicates whether or not cross-site Access-Control requests should be made using credentials
    });
  }

  // Method to use in our SignUp component
  signup = (username, email, password, image) => {
    return this.service
      .post("/signup", { username, email, password, image })
      .then(response => response.data)
  };

  // Method to use in our Login component
  login = (email, password) => {
    return this.service
      .post("/login", { email, password })
      .then((response) => response.data);
  };

  // Method to use to see if user is authenticated
  isAuthenticated = () => {
    return this.service.get("/loggedin").then((response) => response.data);
  };


  // Method to use for logging our user out
  logout = () => {
    return this.service.post("/logout", {}).then((response) => response.data);
  };

}

export default AuthService;
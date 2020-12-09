const dev = {
  URL: "dev",
  SERVER_URL: "http://localhost:5000"
};

const prod = {
  URL: "prod",
  SERVER_URL: "https://mr-pan-backend-v6k9j.ondigitalocean.app/"
};

const env = process.env.NODE_ENV === "production" ? prod : dev;

export default env;

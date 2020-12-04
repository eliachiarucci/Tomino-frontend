const dev = {
  url: "dev",
};

const prod = {
  url: "prod",
};

const env = process.env.NODE_ENV === "production" ? prod : dev;

export default env;

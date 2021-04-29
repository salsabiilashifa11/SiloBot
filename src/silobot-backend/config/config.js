module.exports = {
  "development": {
    "username": "postgres",
    "password": "delapan1",
    "database": "silobot_development",
    "host": "localhost",
    "dialect": "postgres",
    "operatorAliases": false
  },
  production: {
    dialect: "postgres",
    operatorAliases: false,
    use_env_variable: "DATABASE_URL",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    },
  }
}

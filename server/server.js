const express = require("express");
// import ApolloServer
const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth");
const path = require("path");

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // pass in a context method that's set to return whatever you want available in the resolvers.
  // This would see the incoming request and return only the headers
  // On the resolver side, those headers would become the context parameter.

  // setting "context: authMiddleware" ensures that every request performs an authentication check, and the updated request object will be passed to the resolvers as the context
  context: authMiddleware,
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  // Serve up static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }

  // wildcard GET route for the server
  // if we make a GET request to any location on the server that doesn't have an explicit route defined,
  // respond with the production-ready React front-end code
  app.get("*", (req, res) => {
    // instruct the Express.js server to serve any files in the React application's build directory in the client folder
    // *NOTE: build folder are only added in production
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // log where we can go to test our GQL API
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);

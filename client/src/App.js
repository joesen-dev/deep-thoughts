import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  // ApolloProvider is a special type React component that we'll use to provide data to all of the other components.
  ApolloProvider,
  // ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server.
  ApolloClient,
  // InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.
  InMemoryCache,
  // createHttpLink allows us to control how the Apollo Client makes a request
  createHttpLink,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";

import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import SingleThought from "./pages/SingleThought";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

// establish a new link to the GraphQL server at its /graphql endpoint with createHttpLink()
const httpLink = createHttpLink({
  // Note use of an absolute path to the server
  // React environment runs at localhost:3000
  // server environment runs at localhost:3001
  // Simimply using /graphql would send our requests to localhost:3000/graphql —which isn't the address for the back-end server.
  // *** uri: "http://localhost:3001/graphql",***
  // the above work in developement but may cause errors in not update before pushing to production

  uri: "/graphql",
  // *** uri: "/graphql", ***
  // coupled with updating the package.json file in the client directory with the following
  // ***"proxy": "http://localhost:3001", ***
  // With this proxy value in place,
  // the Create React App team set up the development server to prefix
  // all HTTP requests using relative paths (e.g., /graphql instead of http://localhost:3001/graphql) with whatever value is provided to it.
  // Now the HTTP requests will work in both development and production environments!
});

// we're not using the first parameter,
// but we still need to access the second one,
// we can use an underscore _ to serve as a placeholder for the first parameter.
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    // set the HTTP request headers of every request to include the token
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// use the ApolloClient() constructor to instantiate the Apollo Client instance and create the connection to the API endpoint
const client = new ApolloClient({
  // combine the authLink and httpLink objects so that every request retrieves the token and
  // sets the request headers before making the request to the API
  link: authLink.concat(httpLink),
  // instantiate a new cache object using new InMemoryCache()
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      {/* the Router component will always contain within it the Routes component. 
      And the Routes component will contain within it the Route component. */}
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile">
                {/* we'll check for a /:username parameter first; 
                if none is provided in the URL path, we'll render the <Profile> component without one */}
                <Route path=":username" element={<Profile />} />
                <Route path="" element={<Profile />} />
              </Route>
              <Route path="/thought/:id" element={<SingleThought />} />

              <Route path="*" element={<NoMatch />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;

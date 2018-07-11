const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const AuthPayload = require("./resolvers/AuthPayload");
const Subscription = require("./resolvers/Subscriptions");

// combining query & mutation & authpayload
const resolvers = {
  Query,
  Mutation,
  AuthPayload,
  Subscription
};

// instantiating the server
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: "src/generated/prisma.graphql", // the auto-generated Prisma DB schema
      endpoint: "http://localhost:4466", // the endpoint of the Prisma DB service
      debug: true // log all GraphQL queries & mutations
    })
  })
});

server.start(() => console.log("Server is running on http://localhost:4000"));

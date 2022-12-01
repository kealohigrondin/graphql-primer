const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const schema = require("./schema/schema");

const app = express();

//graphiql is a dev tool that allows us to query against our dev server
app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));
app.listen(4000, () => {
  console.log("Server listening on port 4000");
});

/*****EXAMPLE QUERY IN GRAPHIQL*****

{
  user(id: "23") {id, firstName, age}
}

//look at the user schema for a user with id=23
//  once found, return the id, firstName, and age
*/

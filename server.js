const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const app = express();

//graphiql is a dev tool that allows us to query against our dev server

app.use("/graphql", graphqlHTTP({ graphiql: true }));
app.listen(4000, () => {
  console.log("Server listening on port 4000");
});

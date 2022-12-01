const {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = require("graphql");
const axios = require("axios");
const baseUrl = "http://localhost:3000";

/**
 * Company has an id, name, description, and resolved users
 * the resolve
 */
const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`${baseUrl}/companies/${parentValue.id}/users`)
          .then((res) => res.data); //returns the data value instead of the entire result
      },
    },
  }),
});

/**
 * UserType represents a object type of name "User"
 *  name: name of this object type
 *  fields: the name and type of each member variable
 * 
 * SAMPLE QUERY: 
 * {
 *   user(id: "2") {id, age, company {
 *     id, name
 * }}
}
 */
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        //parentvalue is what node the request is originating from (a user in this case)
        //resolve functions are the edges that connect nodes (users/companies/etc)
        //  and are monodirectional (is that a word?)
        return axios
          .get(`${baseUrl}/companies/${parentValue.companyId}`)
          .then((res) => res.data);
      },
    },
  }),
});

/**
 * Purpose: allow graphql to jump and land on a very specific node in the graph
 */
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    //each field makes that type queryable from the root query
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } }, //allows code to query the graph with an id and return an user
      resolve(parentValue, args) {
        //parentvalue is what node the request originates from
        //the rootquery will have null parentvalue since it isnt coming from a node
        //args contains the query params that are passed in (id in this case)
        return axios.get(`${baseUrl}/users/${args.id}`).then((res) => res.data); //get user with id of args.id from json server
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`${baseUrl}/companies/${args.id}`)
          .then((res) => res.data);
      },
    },
  },
});

/**
 * allows modifications to the graph
 * each field is a different type of operation
 */
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType, //type of data being returned from resolve
      args: {
        //all the data being added to the new user
        firstName: { type: new GraphQLNonNull(GraphQLString) }, //GraphQLNonNull requires this arg to be non-null
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }, //since this isn't wrapped in a non-null, it isn't a req'd arg
      },
      resolve(parentValue, { firstName, age }) {
        return axios
          .post(`${baseUrl}/users`, { firstName, age })
          .then((res) => res.data);
      },
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parentValue, { id }) {
        return axios.delete(`${baseUrl}/users/${id}`).then((res) => res.data);
        //returns null on successful deletion
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        //patch updates an existing record, put overwrites an existing object with exactly what you pass to it
        return axios
          .patch(`${baseUrl}/users/${args.id}`, args)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

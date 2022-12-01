# graphql-primer

GraphQL tutorial on udemy

## Notes

json-server automatically recognizes foreign keys in db.json (see companyId and company in at http://localhost:3000/companies/1/users)

## Sample Queries

### Graphiql

#### For a user of id "2", return their id, age, and company's id and name

{
user(id: "2") {id, age, company {
id, name
}}
}

#### Get company of id "2"s id and name

{
company(id: "2") {id, name}
}

#### For a company of id "1", return the id, name and users' firstNames associated with that company

{
company(id: "1") {id, name, users {firstName}}
}

#### Recursive queries for company inside users inside a company

{
company(id: "2") {id, name, users {firstName, company{name}}}
}

#### Query for multiple items (and name them whatever) while using fragments

{
company1: company(id: "1") {...companyDetails}
company2: company(id: "2") {...companyDetails}
}

fragment companyDetails on Company {id, name, description}

#### Add a user to the db

mutation{
addUser (firstName:"Steve", age: 24) {
id
firstName
age
}}

#### Remove user from db

mutation{
deleteUser (id: "id_of_user") {id}
}

### Json-Server

http://localhost:3000/companies/1/users gets users for company of id "1"

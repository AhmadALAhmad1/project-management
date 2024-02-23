const express = require('express');
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const colors = require('colors')
const port = process.env.PORT || 5000;
const connectDB = require('./config/db');

//initialize express
const app = express();

//connect to database
connectDB();


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development' ? true : false, //only show GraphiQL in dev mode
}));

app.listen(port, console.log(`Server is running on port ${port}`));
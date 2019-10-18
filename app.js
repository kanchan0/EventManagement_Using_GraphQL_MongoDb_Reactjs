const express           =   require("express");
const bodyParser        =   require("body-parser");
const graphqlHttp       =   require("express-graphql");
const mongoose          =   require("mongoose");
const mongoURI          =   require("./config/keys");
const graphQLSchema     =   require("./graphql/schema/index")
const graphQLResolver   =   require("./graphql/resolvers/index")
const isAuth            =   require("./middleware/is-auth")


const app = express();
app.use(bodyParser.json());

//Including this middleware to get out of cors error
//that occurs because we have different servers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method == 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

app.use(isAuth);
app.use('/graphql',graphqlHttp({
    schema:graphQLSchema,
    rootValue:graphQLResolver,
    graphiql:true  
}));


mongoose.connect(mongoURI.keys.MONGO,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    app.listen(7000,()=>{
        console.log("server started at : 7000")
    });

})
.catch(err=>{
    console.log(err);
})


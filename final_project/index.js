const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { authenticated } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const books_route = require('./router/booksdb.js');


const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/books", books_route);


app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the user is authenticated via session

        // Check if there's a JWT token in the request headers
console.log(req.session)

        if(req.session){
            if(req.session.authorization){
                    let token = req.session.authorization.token;
                    jwt.verify(token, 'my-secret-key', (err, user) => {
                        if (err) {
                            // Token verification failed
                            res.status(401).json({ error: 'galek err' });
                        } else {
                            req.session.user = user;
                            next();
                        }
                    });


            }
            else{
                res.status(401).json({ error: 'Unauthorized here' });
            }
        }


    
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));

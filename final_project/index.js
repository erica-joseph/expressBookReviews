const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if there's an active session and a stored token
    if (req.session && req.session.authorization) {
        const token = req.session.authorization.token;

        // Verify the JWT token using the same secret key used to sign it
        jwt.verify(token, 'my-secret-key', (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            } else {
                // Token is valid, optionally attach user info to request
                req.user = user;
                next(); // proceed to the next middleware/route
            }
        });
    } else {
        // No session or no token → unauthorized
        return res.status(401).json({ message: "User not logged in" });
    }
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
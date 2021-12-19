const express = require("express"); // Express
const router = express.Router();
const { body, validationResult } = require("express-validator"); // Express Validator
const bcrypt = require("bcryptjs"); // bcrypt for hashing or ecryption
const jwt = require("jsonwebtoken"); // JSON web token

const User = require("../models/User");
const fetchUser = require("../middleware/fetchUser");

const JWT_SECRET = process.env.JWT_SECRET_MESSAGE;

//* ROUTE 1
// Create a User using: POST "/api/auth/createuser". No Login Required
router.post(
    "/createuser",
    [
        body("name", "Enter a valid Name").isLength({ min: 3 }),
        body("email", "Enter a valid Email").isEmail(),
        body("password", "Password must be minimum 5 charaters").isLength({
            min: 5,
        }),
    ],
    async (req, res) => {
        // If error then return Bad Request with error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        // Check whether the email is taken or not
        try {
            let success = false;
            let user = await User.findOne({ email: req.body.email }); // Unique email
            if (user)
                return res
                    .status(400)
                    .json({ success, error: "Email already taken!" });

            // Securing User Password
            const salt = await bcrypt.genSalt(10);
            securePass = await bcrypt.hash(req.body.password, salt);

            // Creating a new User
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: securePass,
            });

            const data = {
                user: {
                    id: user.id,
                },
            };
            const authToken = jwt.sign(data, JWT_SECRET);

            success = true;
            //console.log(jwtData);
            res.json({ success, authToken });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Sever Error");
        }
    }
);

//* ROUTE 2
// Authenticate a User using: POST "/api/auth/login". No Login Required
router.post(
    "/login",
    [
        body("email", "Enter a valid Email").isEmail(),
        body("password", "Password cannot be blank").exists(),
    ],
    async (req, res) => {
        // If error then return Bad Request with error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let success = false;
            let user = await User.findOne({ email });
            if (!user)
                return res
                    .status(400)
                    .json({ success, error: "Invalid Credentials" });

            const passwordCompare = await bcrypt.compare(
                password,
                user.password
            );
            if (!passwordCompare)
                return res
                    .status(400)
                    .json({ success, error: "Invalid Credentials" });

            const data = {
                user: {
                    id: user.id,
                },
            };
            const authToken = jwt.sign(data, JWT_SECRET);

            success = true;
            res.json({ success, authToken });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Sever Error");
        }
    }
);

//* ROUTE 3
// Get logged in User details using: POST "/api/auth/getuser". Login Required
router.post("/getuser", fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Sever Error");
    }
});

// Export Router
module.exports = router;

// Create User
// User.create({
//   name: req.body.name,
//   email: req.body.email,
//   password: req.body.password,
// })
//   .then((user) => res.json(user))
//   .catch((err) => {
//     console.log(err);
//     res.json({ error: "Email already in use", message: err.message });
//   });

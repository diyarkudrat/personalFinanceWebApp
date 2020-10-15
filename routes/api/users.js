const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

// load input validation
const validateSignInInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// load User model
const User = require('../../models/User');


// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/signup', (req, res) => {
    const { errors, isValid } = validateSignInInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: 'Email already exists' });
        } else {
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(24, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route POST api/users/login
// @descr Login user and return JWT
// @access Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(200).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ emailNotFound: "Email not found" });
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = {
                    id: user.id,
                    name: user.firstName + user.lastName
                };
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 24822481
                    },
                    (err, token) => {
                        res.json({ success: true, token: "Bearer" + token });
                    }
                );
            } else {
                return res.status(400).json({ passwordIncorrect: "Password Incorrect" });
            }
        });
    });
});

module.exports = router;
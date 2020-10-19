const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');

require('dotenv').config();

const users = require('./routes/api/users');
const plaid = require('./routes/api/plaid');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require('./config/keys').mongoURI;

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

// Passport Middleware
app.use(passport.initialize());
require('./config/passport')(passport);


// Routes
app.use('/api/users', users);
app.use('/api/plaid', plaid);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
      res.sendFile(path.join('client/build/index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}!`));




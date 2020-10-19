const express = require('express');
const plaid = require('plaid');
const router = express.Router();
const passport = require('passport');
const moment = require('moment');
const mongoose = require('mongoose');

const Account = require('../../models/Account');
const User = require('../../models/User');

require('dotenv').config();

const PLAID_CLIENT_ID = "5f8a73037c8b68001175ecdb";
const PLAID_SECRET = "81ec57067df5f09e25c987379ce294";

const client = new plaid.Client({
  clientID: PLAID_CLIENT_ID,
  secret: PLAID_SECRET,
  env: plaid.environments.sandbox
});

// clientID: "5f8a73037c8b68001175ecdb",
// secret: "81ec57067df5f09e25c987379ce294",
var PUBLIC_TOKEN = null;
var ACCESS_TOKEN = null;
var ITEM_ID = null;

// @route POST api/plaid/accounts/add
// @descr Trade public token for access token and store credentials in db
// @access PRIVATE
router.post('/accounts/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    PUBLIC_TOKEN = req.body.public_token;
    const userId = req.user.id;

    const institution = req.body.metadata.institution;
    const { name, institution_id } = institution;

    if (PUBLIC_TOKEN) {
        client
          .exchangePublicToken(PUBLIC_TOKEN)
          .then(exchangeRes => {
              ACCESS_TOKEN = exchangeRes.access_token;
              ITEM_ID = exchangeRes.item_id;

              Account.findOne({
                  userId: req.user.id,
                  institutionId: institution_id
              }).then(account => {
                  if (account) {
                      console.log('Account already exists');
                  } else {
                      const newAccount = new Account({
                          userId: userId,
                          accessToken: ACCESS_TOKEN,
                          itemId: ITEM_ID,
                          institutionId: institution_id,
                          institutionName: name
                      });

                      newAccount.save().then(account => res.json(account));
                  }
                })
                .catch(err => console.log('Mongo Error', err));
            })
            .catch(err => console.log('Plaid Error', err))
    }
});

// @route DELETE api/plaid/accounts/:id
// @desc Delete account with given ID
// @access Private
router.delete('/accounts/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Account.findById(req.params.id).then(account => {
        account.remove().then(() => res.json({ success: true }));
    });
});

// @route POST api/plaid/create_link_token
// @desc Retrieve link token to be able to use Plaid Link component
// @access Private
router.post('/create_link_token', passport.authenticate('jwt', { session: false }), async (req, res) => {
    clientUserId = req.user.id;

    const linkTokenResponse = await client.createLinkToken({
        user: {
            client_user_id: clientUserId,
        },
        client_name: 'Make School',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
        webhook: 'http://localhost:3000',
    });
    const link_token = linkTokenResponse.link_token;
    res.json({ link_token });
});

// @route GET api/plaid/accounts
// @desc Retrieve all acounts that specific user linked with plaid
// @access Private
router.get('/accounts', passport.authenticate("jwt", { session: false }), (req, res) => {
    Account.find({ userId: req.user.id })
        .then(accounts => res.json(accounts))
        .catch(err => console.log(err));
});

// @route POST api/plaid/accounts/trasactions
// @route Retrieve transactions from the past 30 days from all linked accounts
// @access Private
router.post('/accounts/transactions', passport.authenticate('jwt', { session: false }), (req, res) => {
    const now = moment();
    const today = now.format("YYY-MM-DD");
    const thirtyDaysAgo = now.subtract(30, 'days').format('YYYY-MM-DD');

    let transactions = [];

    const accounts = req.body;

    if (accounts) {
        accounts.forEach(function(account) {
            ACCESS_TOKEN = account.accessToken;
            const institutionName = account.institutionName;

            client
              .getTransactions(ACCESS_TOKEN, thirtyDaysAgo, today)
              .then(response => {
                  transactions.push({
                      accountName: institutionName,
                      transactions: response.transactions
                  });
                  if (transactions.length === accounts.length) {
                      res.json(transactions);
                  }
              })
              .catch(err => console.log(err));
        });
    }
})



module.exports = router;

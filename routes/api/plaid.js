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
router.post('/accounts/add', (req, res) => {
    console.log('BODY', req.body)
    PUBLIC_TOKEN = req.body.plaidData.public_token;
    const userId = req.body.userId;

    const institution = req.body.plaidData.metadata.institution;
    const { name, institution_id } = institution;
    console.log('public token', PUBLIC_TOKEN);
    if (PUBLIC_TOKEN) {
        client
          .exchangePublicToken(PUBLIC_TOKEN)
          .then(exchangeRes => {
              ACCESS_TOKEN = exchangeRes.access_token;
              ITEM_ID = exchangeRes.item_id;

              Account.findOne({ userId: userId, institutionId: institution_id }).then(account => {
                  console.log('Account', account)
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
                      console.log('new account', newAccount);

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
router.delete('/accounts/:id', (req, res) => {
    Account.findById(req.params.id).then(account => {
        account.remove().then(() => res.json({ success: true }));
    });
});

// @route POST api/plaid/create_link_token
// @desc Retrieve link token to be able to use Plaid Link component
// @access Private
router.post('/create-link-token', async (req, res) => {
    try {
        clientUserId = req.body.userId;

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
    } catch (err) {
        return res.send({ error: err });
    }
});

// @route GET api/plaid/accounts
// @desc Retrieve all acounts that specific user linked with plaid
// @access Private
router.post('/accounts', (req, res) => {
    try {
        // console.log('req.body', req.body)
        Account.find({ userId: req.body.userId })
            .then(accounts => res.json(accounts))
            .catch(err => console.log(err));
    } catch (err) {
        return res.send({ error: err });
    }
});

// @route POST api/plaid/accounts/trasactions
// @route Retrieve transactions from the past 30 days from all linked accounts
// @access Private
router.post('/accounts/transactions', (req, res) => {
    const now = moment();
    // const today = now.format("YYY-MM-DD");
    // const thirtyDaysAgo = now.subtract(30, 'days').format('YYYY-MM-DD');

    let transactions = [];

    const accounts = req.body.accounts;

    if (accounts) {
        accounts.forEach(function(account) {
            ACCESS_TOKEN = account.accessToken;
            const institutionName = account.institutionName;

            client
              .getTransactions(ACCESS_TOKEN, '2020-10-01', '2020-10-18')
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

# Personal Finance Banking Web Applciation

## Deployed Site URL
    `https://personal-finance-app-dk.herokuapp.com/`

## Description
    Banking application using the Plaid API to be able to link multiple bank accounts, view all the transactions made from those bank accounts, and search/filter through the transaction

## Tech Stack
    MERN (MongoDB, Express, React, Node)

## Installation
If you would like to clone this repo:
- Run following command in Terminal to clone repo and install npm dependencies:
    -   ```bash
        git clone https://github.com/diyarkudrat/personalFinanceWebApp.git
        ```
    - ```bash
        npm install
        ```
    - ```bash
        cd client
        ```
    - ```bash
        npm install
        ```
- Create config folder in root directory to put in your MongoDB Uri
    - ```bash
        mkdir config
        ```
    - ```bash
        touch keys.js
        ```
    - Insert this code in the keys.js file
        - ```javascript
            module.exports = {
            mongoURI: "<INSERT URI HERE>",
            secretOrKey: "<INSERT SECRET OR KEY HERE>"
            };
            ```
    
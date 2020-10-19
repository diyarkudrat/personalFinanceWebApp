import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { PlaidLink } from 'react-plaid-link';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { getAccounts, addAccount, createLinkToken } from '../../actions/accountActions';
import axios from 'axios';
import TransactionDetails from './TransactionDetails';

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            linkToken: '',
            accounts: [],
            transactions: []
        }
    }

    componentDidMount() {
        this.getAccounts();
        this.getLinkToken();
    }

    onLogoutClick = event => {
        event.preventDefault();
        this.props.logoutUser();
    };

    handleSuccess = async (token, metadata) => {
        const userId = '5f8a431c3b417c6351227674';
        const plaidData = {
            public_token: token,
            metadata: metadata
        };
        await axios.post("http://localhost:5000/api/plaid/accounts/add", { plaidData, userId });
    }

    getLinkToken = async () => {
        const userId = '5f8a431c3b417c6351227674';
        const response = await axios.post("http://localhost:5000/api/plaid/create-link-token", { userId });
        const linkToken = response.data.link_token;
        this.setState({ linkToken })
    }

    getAccounts = async () => {
        const userId = '5f8a431c3b417c6351227674';
        const response = await axios.post('http://localhost:5000/api/plaid/accounts', { userId });
        this.setState({ accounts: response.data }, () => {
            this.getTransactions(this.state.accounts);
        })
    }

    getTransactions = async (accounts) => {
        const response = await axios.post('http://localhost:5000/api/plaid/accounts/transactions', { accounts });
        this.setState({ transactions: response.data });
    }

    render() {
        const { user } = this.props.auth;

        return (
            <div style={{ height: "75vh" }}>
                <div className="row">
                <div>
                    <h4>
                        <b>Hey there,</b> {user.name.split(" ")[0]}
                        <p className="flow-text grey-text text-darken-1">
                            You are logged into PersonalFinance!
                        </p>
                    </h4>
                    { this.state.linkToken ? 
                        <PlaidLink
                            token={this.state.linkToken}
                            onSuccess={this.handleSuccess}> 
                            Connect a bank account 
                        </PlaidLink> : 
                        null 
                    }
                </div>
                <div>
                    { this.state.transactions ? <TransactionDetails transactions={this.state.transactions} /> : null }
                </div>
                    <button onClick={this.onLogoutClick}>Logout</button>
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    getAccounts: PropTypes.func.isRequired,
    addAccount: PropTypes.func.isRequired,
    createLinkToken: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    plaid: state.plaid
});

export default connect(
    mapStateToProps,
    { logoutUser, getAccounts, addAccount, createLinkToken }
)(Dashboard);
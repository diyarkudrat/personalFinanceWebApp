import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { PlaidLink } from 'react-plaid-link';
import Button from '@material-ui/core/Button';
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
        const userId = this.props.auth.user.id;
        const plaidData = {
            public_token: token,
            metadata: metadata
        };
        await axios.post("http://localhost:5000/api/plaid/accounts/add", { plaidData, userId });
    }

    getLinkToken = async () => {
        const userId = this.props.auth.user.id;
        const response = await axios.post("http://localhost:5000/api/plaid/create-link-token", { userId });
        const linkToken = response.data.link_token;
        this.setState({ linkToken })
    }

    getAccounts = async () => {
        // const userId = '5f8a431c3b417c6351227674';
        debugger;
        const userId = this.props.auth.user.id;
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
                    <h2 style={{marginLeft: '36%'}}><b>Hello,</b> {user.name.split(" ")[0]}!</h2>
                    <div style={{marginLeft: '38%'}}>
                        { this.state.linkToken ? 
                            <PlaidLink
                                token={this.state.linkToken}
                                onSuccess={this.handleSuccess}> 
                                Connect a bank account 
                            </PlaidLink> : 
                            null 
                        }
                    </div>
                    {/* <button style={{marginLeft: '42%', marginTop: '10px'}} onClick={this.onLogoutClick}>Logout</button> */}
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={this.onLogoutClick}
                      style={{marginLeft: '40%', marginTop: '10px'}}
                    >
                    Log Out
                    </Button>
                </div>
                <div>
                    { this.state.transactions ? <TransactionDetails transactions={this.state.transactions} accounts={this.state.accounts} user={user} linkToken={this.props.linkToken} /> : null }
                </div>
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
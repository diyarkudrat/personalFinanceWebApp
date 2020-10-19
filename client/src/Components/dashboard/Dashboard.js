import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PlaidLink } from 'react-plaid-link';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
// import { getAccounts, addAccount, createLinkToken } from '../../actions/accountActions';
import Accounts from './Accounts';
import Table from './Table';

class Dashboard extends Component {
    // componentDidMount() {
    //     this.props.getAccounts();
    // }

    onLogoutClick = event => {
        event.preventDefault();
        this.props.logoutUser();
    };

    // handleSuccess = (token, metadata) => {
    //     const plaidData = {
    //         public_token: token,
    //         metadata: metadata
    //     };
    //     this.props.addAccount(plaidData);
    // }

    render() {
        const { user } = this.props.auth;

        return (
            <div style={{ height: "75vh" }}>
                <div className="row">
                <div>
                    <h4>
                    <b>Hey there,</b> {user.name.split(" ")[0]}
                    {/* <b>Hey there,</b> {user.id} */}
                    <p className="flow-text grey-text text-darken-1">
                        You are logged into PersonalFinance!
                    </p>
                    </h4>
                    {/* <PlaidLink
                        token={this.props.createLinkToken()}
                        onSuccess={this.handleSuccess}
                    /> */}

                    <button
                        onClick={this.onLogoutClick}
                    >
                    Logout
                    </button>
                </div>
                </div>
            </div>
        );
    }
}

// Dashboard.propTypes = {
//     logoutUser: PropTypes.func.isRequired,
//     auth: PropTypes.object.isRequired,
//     getAccounts: PropTypes.func.isRequired,
//     addAccount: PropTypes.func.isRequired,
//     createLinkToken: PropTypes.func.isRequired,
// };

// const mapStateToProps = state => ({
//     auth: state.auth,
//     plaid: state.plaid
// });

// export default connect(
//     mapStateToProps,
//     { logoutUser, getAccounts, addAccount, createLinkToken }
// )(Dashboard);
export default Dashboard;
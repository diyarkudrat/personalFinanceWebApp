import React, { Component, forwardRef } from 'react';
import { PlaidLink } from 'react-plaid-link';
import MaterialTable from 'material-table';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';

import axios from 'axios';

class TransactionDetails extends Component {

    onDeleteClick = async (accountId) => {
        await axios.delete(`http:localhost:5000/api/plaid/accounts/${accountId}`)
    };

    handleSuccess = async (token, metadata) => {
        const userId = '5f8a431c3b417c6351227674';
        const plaidData = {
            public_token: token,
            metadata: metadata
        };
        await axios.post("http://localhost:5000/api/plaid/accounts/add", { plaidData, userId });
    }

    render() {
        let accountItems = this.props.accounts.map((account) => {
            return(
                <li key={account._id} style={{ marginTop: "1rem" }}>
                    {/* <button style={{ marginRight: "1rem" }} onClick={this.onDeleteClick(account._id)}>Delete</button> */}
                    <b>{account.institutionName}</b>
                </li>
            )
        })

        const transactionsColumns = [
            { title: "Account", field: "account" },
            { title: "Date", field: "date", type: "date", defaultSort: "desc" },
            { title: "Name", field: "name" },
            { title: "Amount", field: "amount", type: "numeric" },
            { title: "Category", field: "category" }
        ];

        const tableIcons = {
            Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
            SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
            Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
            LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
            FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
            Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
            NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
            PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
            ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),

        }

        let transactionsData = [];
        this.props.transactions.map((account) => {
            account.transactions.map((transaction) => {
                const price = transaction.amount.toFixed(2)
                transactionsData.push({
                    account: transaction.account_id,
                    date: transaction.date,
                    category: transaction.category[0],
                    name: transaction.name,
                    amount: `$${price}`
                });
            });
        });

        return (
            <>
            <h3><b>Linked Accounts</b></h3>
            <ul>{accountItems}</ul>
            {this.props.linkToken ? 
                <PlaidLink
                    token={this.props.linkToken}
                    onSuccess={this.handleSuccess}> 
                    Add Account 
                </PlaidLink>
            :
                null
            }

            <h2>Transactions</h2>
            
            <MaterialTable
                icons={tableIcons}
                columns={transactionsColumns}
                data={transactionsData}
                title="Search Transactions"
              />

            </>
        )
    }
    
}

// this.props.transactions.map((account) => {
//     return (
//         account.transactions.map(transaction => {
//             return(
//                 <p>{transaction.merchant_name}</p>
//             )
//         })
//     )
// })
export default TransactionDetails;
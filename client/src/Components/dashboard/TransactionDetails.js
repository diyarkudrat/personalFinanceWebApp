import React, { Component } from 'react';


class TransactionDetails extends Component {
    render() {
        return (
            this.props.transactions.map((account) => {
                return (
                    account.transactions.map(transaction => {
                        return(
                            <p>{transaction.merchant_name}</p>
                        )
                    })
                )
            })
        )
    }

}

export default TransactionDetails;
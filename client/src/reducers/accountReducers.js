import {
    ADD_ACCOUNT,
    DELETE_ACCOUNT,
    GET_ACCOUNTS,
    ACCOUNTS_LOADING,
    GET_TRANSACTIONS,
    TRANSACTIONS_LOADING,
    LINK_TOKEN
} from "../actions/types";

const initialState = {
    accounts: [],
    transactions: [],
    accountsLoading: false,
    transactionsLoading: false,
    linkToken: null,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case LINK_TOKEN:
            return {
                ...state,
                linkToken: action.payload
            }
        case ACCOUNTS_LOADING:
            return {
                ...state,
                accountsLoading: true
            };
        case ADD_ACCOUNT:
            return {
                ...state,
                accounts: [action.payload, ...state.accounts]
            };
        case DELETE_ACCOUNT:
            return {
                ...state,
                accounts: state.accounts.filter(account => account._id !== action.payload)
            };
        case TRANSACTIONS_LOADING:
            return {
                ...state,
                transactionsLoading: true
            };
        case GET_ACCOUNTS:
            return {
                ...state,
                accounts: action.payload,
                accountsLoading: false
            };
        case GET_TRANSACTIONS:
            return {
                ...state,
                transactions: action.payload,
                transacationLoading: false
            };
        default:
            return state;
    }
}
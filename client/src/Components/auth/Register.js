import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import classnames from 'classnames';

class Register extends Component {
    constructor() {
        super();
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            errors: {}
        };
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = event => {
        this.setState({ [event.target.id]: event.target.value });
    };

    onSubmit = event => {
        event.preventDefault();
        
        const newUser = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        };
        this.props.registerUser(newUser, this.props.history);
    };

    useStyles = makeStyles((theme) => ({
        paper: {
          marginTop: theme.spacing(8),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        avatar: {
          margin: theme.spacing(1),
          backgroundColor: theme.palette.secondary.main,
        },
        form: {
          width: '100%', // Fix IE 11 issue.
          marginTop: theme.spacing(3),
        },
        submit: {
          margin: theme.spacing(3, 0, 2),
        },
    }));

    render() {
        const { errors } = this.state;
        const classes = this.useStyles;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <form className={classes.form} onSubmit={this.onSubmit} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                  autoComplete="firstName"
                                  name="firstName"
                                  variant="outlined"
                                  required
                                  fullWidth
                                  id="firstName"
                                  label="First Name"
                                  error={errors.name}
                                  value={this.state.firstName}
                                  onChange={this.onChange}
                                  autoFocus
                                  className={classnames("", {
                                      invalid: errors.firstName
                                  })}
                                />
                                <span>{errors.firstName}</span>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                  autoComplete="lastName"
                                  name="lastName"
                                  variant="outlined"
                                  required
                                  fullWidth
                                  id="lastName"
                                  label="Last Name"
                                  error={errors.name}
                                  value={this.state.lastName}
                                  onChange={this.onChange}
                                  autoFocus
                                  className={classnames("", {
                                      invalid: errors.lastName
                                  })}
                                />
                                <span>{errors.lastName}</span>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                  variant="outlined"
                                  required
                                  fullWidth
                                  id="email"
                                  label="Email Address"
                                  name="email"
                                  autoComplete="email"
                                  onChange={this.onChange}
                                  value={this.state.email}
                                  error={errors.email}
                                  className={classnames("", {
                                      invalid: errors.email
                                  })}
                                />
                                <span>{errors.email}</span>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                  variant="outlined"
                                  required
                                  fullWidth
                                  name="password"
                                  label="Password"
                                  type="password"
                                  id="password"
                                  onChange={this.onChange}
                                  value={this.state.password}
                                  error={errors.password}
                                  className={classnames("", {
                                      invalid: errors.password
                                  })}
                                />
                                <span>{errors.password}</span>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                  variant="outlined"
                                  required
                                  fullWidth
                                  name="confirmPassword"
                                  label="Confirm Password"
                                  type="confirmPassword"
                                  id="confirmPassword"
                                  onChange={this.onChange}
                                  value={this.state.confirmPassword}
                                  error={errors.confirmPassword}
                                  className={classnames("", {
                                      invalid: errors.confirmPassword
                                  })}
                                />
                                <span>{errors.confirmPassword}</span>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign Up
                        </Button>
                    </form>
                </div>
            </Container>
        );
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { registerUser },
)(withRouter(Register));
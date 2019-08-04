import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import './styles.css';
import LogoMyCodeDev from '../../imgs/devlogo_xcZ_1.ico'
import FirebaseService from '../../services/FirebaseService';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import Loader from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { Animated } from "react-animated-css";
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';


function LoaderLogin(props) {
    const styleLoader = {
        marginLeft: 94
    };
    return (
        <div className={!props.submit ? "hidden" : ""} style={styleLoader}>
            <Loader type="Rings" color="#00BFFF" height="50" width="50" />
        </div>
    );
}

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            validEmail: false,
            validPassword: false,
            showLoader: true,
            animationVisible: true,
            animationIn: 'fadeIn',
            animationOut: 'bounceOutLeft'
        }
    }

    componentDidMount() {
        FirebaseService.verifyUserLogin(this.state, ToastsStore).then(
            resolve => {
                if (resolve) {
                    localStorage.setItem('infoUser', resolve.uid);
                    this.setState({
                        showLoader: false
                    });
                    this.props.history.push({
                        pathname: '/home',
                        search: ''
                    })
                }
            }
        ).catch(
            reject => {
                this.setState({
                    showLoader: false
                });
                localStorage.setItem('infoUser', undefined)
            }
        );
    }

    handleClickLogin(event) {
        if (this.state.validEmail && this.state.validPassword) {
            this.setState({
                showLoader: true
            });
            FirebaseService.loginWithEmailAndPassword(this.state, ToastsStore).then(
                resolve => {
                    localStorage.setItem('infoUser', resolve.uid);
                    this.setState({
                        showLoader: false,
                        animationVisible: false,
                        animationOut: 'bounceOut'
                    });
                    setTimeout(() => {
                        this.props.history.push({
                            pathname: '/home',
                            search: ''
                        })
                        window.location.reload();
                    }, 650)

                }
            ).catch(
                reject => {
                    this.setState({
                        showLoader: false
                    });
                }
            );
        } else {
            ToastsStore.error("Preencha todos os campos!")
        }
    }

    handleClickRegister() {
        this.setState({
            animationVisible: false
        });
        setTimeout(() => {
            this.props.history.push({
                pathname: '/register',
                search: ''
            })
        }, 650);

    }

    render() {
        return (
            <Animated animationIn={this.state.animationIn} animationOut={this.state.animationOut} isVisible={this.state.animationVisible}>
                <div id="container">
                    <div id="container-login">
                        <MuiThemeProvider>
                            <div>
                                <div>
                                    <img src={LogoMyCodeDev} />
                                </div>
                                <TextField
                                    hintText="Digite seu Email"
                                    floatingLabelText="Email"
                                    required
                                    onBlur={({ target: { value } }) => {
                                        this.setState({
                                            email: value,
                                            validEmail: value !== ""
                                        });
                                    }
                                    }

                                />
                                <br />
                                <TextField
                                    type="password"
                                    required
                                    hintText="Digite sua Senha"
                                    floatingLabelText="Senha"
                                    onBlur={({ target: { value } }) => {
                                        this.setState({
                                            password: value,
                                            validPassword: value !== ""
                                        });
                                    }
                                    }
                                />
                                <br />
                                <div id="botoes">
                                    <RaisedButton label="Entrar" primary={true} onClick={(event) => this.handleClickLogin(event)} />
                                    <div style={styleRegister}>
                                        <Button color="primary" onClick={(event) => { this.handleClickRegister() }}>
                                            Registrar
                                            <Icon>forward</Icon>
                                        </Button>
                                    </div>
                                    <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} store={ToastsStore} />
                                    <LoaderLogin submit={this.state.showLoader} />
                                </div>
                            </div>
                        </MuiThemeProvider>
                    </div>
                </div>
            </Animated>
        );
    }
}
const styleButton = {
    margin: 20,
    marginLeft: 80

};

const styleRegister = {
    display: 'flex',
    justifyContent: 'center',
    fontSize: 15
};

export default Login;
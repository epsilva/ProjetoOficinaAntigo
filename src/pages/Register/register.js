import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LogoMyCodeDev from '../../imgs/devlogo_xcZ_1.ico'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from '@material-ui/core/TextField';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import Loader from 'react-loader-spinner';
import ApiService from '../../services/ApiService';
import ValidarEmail from '../../utils/validacao/validarEmail'
import { Animated } from "react-animated-css";
import './styles.css';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import FirebaseService from '../../services/FirebaseService'
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

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

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      validFirstName: false,
      validLastName: false,
      validEmail: false,
      validPassword: false,
      showLoader: false,
      animationVisible: true,
      animationIn: 'bounceInRight',
      animationOut: 'bounceOutLeft'
    }
  }

  componentWillMount() {
    if (this.props.history.location.params !== undefined) {
      this.setState({
        animationIn: this.props.history.location.params.animationIn,
        animationOut: this.props.history.location.params.animationOut
      });
    }
  }

  handleClick(event) {
    if (document.querySelector('#formRegister').reportValidity() && this.formValidate()) {
      if (this.state.validFirstName && this.state.validLastName && this.state.validEmail && this.state.validPassword) {
        this.setState({
          showLoader: true
        });
        FirebaseService.createUserWithEmailAndPassword(this.state, ToastsStore).then(
          resolve => {
            localStorage.setItem('infoUser', resolve.uid);
            this.createJsonUser(this.state, resolve).then(
              userMongo => {
                this.setState({
                  showLoader: false,
                  animationVisible: false
                });
                setTimeout(() => {
                  this.props.history.push({
                    pathname: '/registerWorkShop',
                    search: '',
                    state: { user: userMongo.data }
                  })
                }, 650);
              }
            );
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
  }

  formValidate() {
    return ValidarEmail.validarEmail(this.state.email);
  }

  createJsonUser = (state, resolve) => {
    const user = {
      name: state.firstName + " " + state.lastName,
      email: state.email,
      idFirebase: resolve.user.uid
    }

    return new Promise(function (resolve, reject) {
      ApiService.post('/user', user).then(
        result => {
          resolve(result);
        }
      ).catch(
        error => {
          reject(error);
        }
      );
    });
  };

  handlerVoltar() {
    this.setState({
      animationVisible: false
    });
    setTimeout(() => {
      this.props.history.push({
        pathname: '/',
        search: ''
      })
    }, 650);
  }

  render() {
    return (
      <Animated animationIn={this.state.animationIn} animationOut={this.state.animationOut} isVisible={this.state.animationVisible}>
        <div id="botao-voltar-register">
          <Tooltip title="Voltar">
            <Fab color="secondary" onClick={() => this.handlerVoltar()}>
              <KeyboardArrowLeft />
            </Fab>
          </Tooltip>
        </div>
        <div id="container">
          <div id="container-login">
            <form id="formRegister">
              <MuiThemeProvider>
                <div>
                  <div>
                    <img src={LogoMyCodeDev} />
                  </div>
                  <TextField
                    placeholder="Primeiro Nome"
                    required
                    error={this.state.firstName !== "" || !this.state.validFirstName ? false : true}
                    onChange={({ target: { value } }) => {
                      this.setState({
                        firstName: value,
                        validFirstName: true,
                      });
                    }
                    }
                    onBlur={({ target: { value } }) => {
                      this.setState({
                        validFirstName: true
                      });
                    }
                    }
                    helperText={this.state.firstName !== "" || !this.state.validFirstName ? "" : "Campo Obrigatório!"}
                    value={this.state.firstName}
                    label="Primeiro Nome"
                    margin="normal"
                    style={{ width: '250px' }}
                  />
                  <br />
                  <TextField
                    placeholder="Sobrenome"
                    required
                    error={this.state.lastName !== "" || !this.state.validLastName ? false : true}
                    onChange={({ target: { value } }) => {
                      this.setState({
                        lastName: value,
                        validLastName: true
                      });
                    }
                    }
                    onBlur={({ target: { value } }) => {
                      this.setState({
                        validLastName: true
                      });
                    }
                    }
                    helperText={this.state.lastName !== "" || !this.state.validLastName ? "" : "Campo Obrigatório!"}
                    value={this.state.lastName}
                    label="Sobrenome"
                    margin="normal"
                    style={{ width: '250px' }}
                  />
                  <br />
                  <TextField
                    placeholder="E-mail"
                    required
                    label="E-mail"
                    error={(this.state.email === "" && this.state.validEmail) || !ValidarEmail.validarEmail(this.state.email)}
                    helperText={this.state.email === "" && this.state.validEmail ? "Campo Obrigatório!" : !ValidarEmail.validarEmail(this.state.email) ? "E-mail Inválido" : ""}
                    onChange={({ target: { value } }) => {
                      this.setState({
                        email: value,
                        validEmail: true
                      });
                    }
                    }
                    onBlur={({ target: { value } }) => {
                      this.setState({
                        email: value,
                        validEmail: true
                      });
                    }
                    }
                    margin="normal"
                    style={{ width: '250px' }}
                    value={this.state.email}
                  />
                  <br />
                  <TextField
                    placeholder="Digite sua senha"
                    required
                    error={this.state.password !== "" || !this.state.validPassword ? false : true}
                    onChange={({ target: { value } }) => {
                      this.setState({
                        password: value,
                        validPassword: true
                      });
                    }
                    }
                    onBlur={({ target: { value } }) => {
                      this.setState({
                        validPassword: true
                      });
                    }
                    }
                    type="password"
                    helperText={this.state.password !== "" || !this.state.validPassword ? "" : "Campo Obrigatório!"}
                    value={this.state.password}
                    label="Senha"
                    margin="normal"
                    style={{ width: '250px' }}
                  />
                  <br />
                  <div id="botao-proximo">
                    {/* <RaisedButton label="Próximo" primary={true} onClick={(event) => this.handleClick(event)} /> */}
                    <Button color="primary" onClick={(event) => { this.handleClick(event) }}>
                      Próximo
                      <Icon>forward</Icon>
                    </Button>
                    <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} store={ToastsStore} />
                    <LoaderLogin submit={this.state.showLoader} />
                  </div>
                </div>
              </MuiThemeProvider>
            </form>
          </div>
        </div>
      </Animated>
    );
  }
}
const style = {
  marginLeft: 70
};
export default Register;
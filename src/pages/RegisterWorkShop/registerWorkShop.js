import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LogoMyCodeDev from '../../imgs/devlogo_xcZ_1.ico'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from '@material-ui/core/TextField';
import InputMask from 'react-input-mask'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import Loader from 'react-loader-spinner';
import ApiService from '../../services/ApiService';
import { Animated } from "react-animated-css";
import './styles.css';
import MaskCnpj from '../../utils/maskCnpj'
import MaskCellPhone from '../../utils/maskCellPhone'
import MaskPhone from '../../utils/maskPhone'
import ValidarCnpj from '../../utils/validacao/validarCnpj'
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

class RegisterWorkShop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFantasy: '',
      socialReason: '',
      cnpj: '',
      phone: '',
      cellPhone: '',
      user: '',
      validNameFantasy: false,
      validaSocialReason: false,
      validCnpj: false,
      showLoader: false,
      animationVisible: true,
      animationIn: 'bounceInRight',
      animationOut: 'bounceOutRight'
    }
  }

  handleClick(event) {
    this.setState({
      showLoader: false,

    });
    if (this.state.validNameFantasy && this.state.validaSocialReason && this.state.validCnpj) {
      this.setState({
        showLoader: true
      });
      this.createJsonWorkShop(this.state).then(
        this.setState({
          showLoader: false,
          animationVisible: false,
          animationOut: 'bounceOut'
        }),
        setTimeout(() => {
          this.props.history.push('/')
          window.location.reload()
        }, 650)

      );
    } else {
      ToastsStore.error("Preencha todos os campos!")
    }
  }

  createJsonWorkShop = (state) => {
    const workShop = {
      nameFantasy: this.state.nameFantasy,
      socialReason: this.state.socialReason,
      cnpj: this.state.cnpj,
      phone: this.state.phone,
      cellPhone: this.state.cellPhone,
      user: this.props.location.state.user
    }
    return new Promise(function (resolve, reject) {
      ApiService.post('/workShop', workShop).then(
        result => {
          resolve(result)
        }
      ).catch(
        error => {
          reject(error)
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
        pathname: '/register',
        search: '',
        params: {
          animationIn: "bounceInLeft",
          animationOut: "bounceOutRight"
        }
      })
    }, 650);
  }

  render() {
    return (
      <Animated animationIn={this.state.animationIn} animationOut={this.state.animationOut} isVisible={this.state.animationVisible}>
        <div id="botao-voltar">
          <Tooltip title="Voltar">
            <Fab color="secondary" onClick={() => this.handlerVoltar()}>
              <KeyboardArrowLeft />
            </Fab>
          </Tooltip>
        </div>
        <div id="container">
          <div id="container-login">
            <MuiThemeProvider>
              <div>
                <div>
                  <img src={LogoMyCodeDev} />
                </div>
                <TextField
                  placeholder="Nome da Oficina"
                  required
                  error={this.state.nameFantasy !== "" || !this.state.validNameFantasy ? false : true}
                  onChange={({ target: { value } }) => {
                    this.setState({
                      nameFantasy: value,
                      validNameFantasy: true,
                    });
                  }
                  }
                  onBlur={({ target: { value } }) => {
                    this.setState({
                      validNameFantasy: true
                    });
                  }
                  }
                  helperText={this.state.nameFantasy !== "" || !this.state.validNameFantasy ? "" : "Campo Obrigatório!"}
                  value={this.state.nameFantasy}
                  label="Oficina"
                  margin="normal"
                  style={{ width: '250px' }}
                />
                <br />
                <TextField
                  placeholder="Razão Social"
                  required
                  error={this.state.socialReason !== "" || !this.state.validaSocialReason ? false : true}
                  onChange={({ target: { value } }) => {
                    this.setState({
                      socialReason: value,
                      validaSocialReason: true,
                    });
                  }
                  }
                  onBlur={({ target: { value } }) => {
                    this.setState({
                      validaSocialReason: true
                    });
                  }
                  }
                  helperText={this.state.socialReason !== "" || !this.state.validaSocialReason ? "" : "Campo Obrigatório!"}
                  value={this.state.socialReason}
                  label="Razão Social"
                  margin="normal"
                  style={{ width: '250px' }}
                />
                <br />
                <TextField
                  placeholder="CNPJ da oficina"
                  required
                  label="CNPJ"
                  InputProps={{
                    inputComponent: MaskCnpj,
                  }}
                  error={(this.state.cnpj === "" && this.state.validCnpj) || !ValidarCnpj.validarCNPJ(this.state.cnpj)}
                  helperText={this.state.cnpj === "" && this.state.validCnpj ? "Campo Obrigatório!" : !ValidarCnpj.validarCNPJ(this.state.cnpj) ? "CNPJ Inválido" : ""}
                  onChange={({ target: { value } }) => {
                    this.setState({
                      cnpj: value,
                      validCnpj: true
                    });
                  }
                  }
                  onBlur={({ target: { value } }) => {
                    this.setState({
                      cnpj: value,
                      validCnpj: true
                    });
                  }
                  }
                  margin="normal"
                  style={{ width: '250px' }}
                  value={this.state.cnpj}
                />
                <br />
                <TextField
                  placeholder="Telefone da oficina"
                  label="Telefone"
                  InputProps={{
                    inputComponent: MaskPhone,
                  }}
                  onChange={({ target: { value } }) => {
                    this.setState({
                      phone: value
                    });
                  }
                  }
                  margin="normal"
                  value={this.state.phone}
                  style={{ width: '250px' }}
                />
                <br />
                <TextField
                  placeholder="Celular da oficina"
                  label="Celular"
                  InputProps={{
                    inputComponent: MaskCellPhone,
                  }}
                  onChange={({ target: { value } }) => {
                    this.setState({
                      cellPhone: value
                    });
                  }
                  }
                  margin="normal"
                  style={{ width: '250px' }}
                  value={this.state.cellPhone}
                />
                <br />
                <div id="botao-registrar">
                  <RaisedButton label="Registrar" primary={true} style={style} onClick={(event) => this.handleClick(event)} />
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
const style = {
  marginLeft: 70
};
export default RegisterWorkShop;
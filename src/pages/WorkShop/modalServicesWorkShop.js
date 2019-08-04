import React, { Component } from 'react';
import ApiService from '../../services/ApiService';
import './styles.css';
import Loader from 'react-loader-spinner';
import TextField from '@material-ui/core/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SaveIcon from '@material-ui/icons/Save';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastsStore } from 'react-toasts';
import { green } from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import CurrencyInput from 'react-currency-input';
import { Animated } from "react-animated-css";


var workShop;

class WorkShop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animationVisible: true
        };
    }

    popularWorkShopServices() {
        workShop = {
            _id: this.props.this.state.idWorkShop,
            service: this.props.this.state.data
        }
    }

    handleClose() {
        this.setState({
            animationVisible: false
        });
        setTimeout(() => {
            this.props.this.setState({
                idServico: '',
                nomeServico: '',
                valorServico: '',
                openModal: false
            });
        }, 800);
    }

    handlerAddServico() {
        if (document.querySelector('#formModalService').reportValidity()) {
            if (this.props.this.state.idServico !== '') {
                const data = this.props.this.state.data;
                const index = data.indexOf(this.props.this.oldDataService);

                var newValor;
                if (this.props.this.state.oldDataService.valor !== this.props.this.state.valorServico) {
                    newValor = parseFloat(this.props.this.state.valorServico.replace('R$ ', '').replace('.', '').replace(',', '.'))
                } else {
                    newValor = this.props.this.state.oldDataService.valor
                }

                var newData = {
                    id: this.props.this.state.oldDataService.id,
                    name: this.props.this.state.nomeServico,
                    valor: newValor
                };

                data[index] = newData;
                this.props.this.setState({ data: data })
            } else {
                const data = this.props.this.state.data;
                var newData = {
                    name: this.props.this.state.nomeServico,
                    valor: parseFloat(this.props.this.state.valorServico.replace('R$ ', '').replace('.', '').replace(',', '.'))
                };
                data.push(newData);
                this.props.this.setState({ data: data })
            }
            this.handlerUpdateOficinaServices();
        }
    }

    handlerUpdateOficinaServices() {
        this.popularWorkShopServices();
        this.props.this.setState({
            successButtonModal: false,
            loadingButtonModal: true,
        });
        ApiService.put('/workShop/' + workShop._id, workShop).then(
            () => {
                this.props.this.setState({
                    successButtonModal: true,
                    loadingButtonModal: false,
                });
                setTimeout(() => {
                    this.props.this.setState({
                        successButtonModal: false,
                        loadingButtonModal: false,
                    });
                    this.handleClose();
                }, 1000);
                ToastsStore.success('Dados registrados com sucesso!!')
            }
        ).catch(
            error => {
                console.log(error)
                this.props.this.setState({
                    successButtonModal: false,
                    loadingButtonModal: false,
                    errorButtonModal: true,
                });
                setTimeout(() => {
                    this.props.this.setState({
                        successButtonModal: false,
                        loadingButtonModal: false,
                        errorButtonModal: false,
                    });
                }, 2000);
                ToastsStore.error('Ops!! Erro ao salvar seus dados')
            }
        );
    }

    render() {
        return (
            <div id='modal'>
                <Animated animationIn="bounceIn" animationOut="bounceOut" isVisible={this.state.animationVisible}>
                    <div id='modal'>
                        <form id="formModalService">
                            <AppBar>
                                <Toolbar>
                                    <Typography variant="h6">Serviços Oferecidos</Typography>
                                </Toolbar>
                            </AppBar>
                            <div id='container-modal'>
                                <div id='container-fileds-modal'>
                                    <MuiThemeProvider>
                                        <div>
                                            <TextField
                                                placeholder="Serviço"
                                                required
                                                error={this.props.this.state.nomeServico !== "" || !this.props.this.state.validNomeServico ? false : true}
                                                onChange={({ target: { value } }) => {
                                                    this.props.this.setState({
                                                        nomeServico: value,
                                                        validNomeServico: true
                                                    });
                                                }
                                                }
                                                onBlur={({ target: { value } }) => {
                                                    this.props.this.setState({
                                                        validNomeServico: true
                                                    });
                                                }
                                                }
                                                value={this.props.this.state.nomeServico}
                                                helperText={this.props.this.state.nomeServico !== "" || !this.props.this.state.validNomeServico ? "" : "Campo Obrigatório!"}
                                                label="Oficina"
                                                margin="normal"
                                                style={{ width: '350px' }}
                                            />
                                        </div>
                                    </MuiThemeProvider>
                                </div>
                                <div id='container-fileds-modal'>
                                    <div id='field'>
                                        <label id="field">Valor</label>
                                        <div id='after-label'></div>
                                        <CurrencyInput
                                            className="currency-field"
                                            prefix="R$ "
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            value={this.props.this.state.valorServico}
                                            onChangeEvent={({ target: { value } }) => {
                                                this.props.this.setState({
                                                    valorServico: value
                                                });
                                            }
                                            }
                                        />
                                        <div>
                                            <hr aria-hidden="true" id='linha-field-1'></hr>
                                            <hr aria-hidden="true" id='linha-field-2'></hr>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="container-btn-modal">
                                <Fab
                                    aria-label="Save"
                                    onClick={() => this.handlerAddServico()}
                                    style={{ marginRight: '10px', borderRadius: '50%', backgroundColor: this.props.this.state.successButtonModal ? green[500] : this.props.this.state.errorButtonModal ? "#F44336" : "#6EC2D7" }}
                                >
                                    {this.props.this.state.successButtonModal ? <CheckIcon style={{ color: "white" }} /> : this.props.this.state.errorButtonModal ? <ErrorIcon style={{ color: "white" }} /> : <SaveIcon style={{ color: "white" }} />}
                                    {this.props.this.state.loadingButtonModal && <CircularProgress size={68} style={{
                                        position: 'absolute',
                                        top: '-9.9%',
                                        zIndex: 1,
                                        color: green[500]
                                    }} />}
                                </Fab>
                                <br />
                                <Fab
                                    aria-label="Save"
                                    onClick={() => this.handleClose()}
                                    style={{ borderRadius: '50%', backgroundColor: "#F44336" }}
                                >
                                    <CloseIcon style={{ color: "white" }} />
                                </Fab>
                            </div>
                        </form>
                    </div>
                </Animated>
            </div>

        );
    }
}

export default WorkShop;
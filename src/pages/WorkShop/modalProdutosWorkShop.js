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
import Tooltip from '@material-ui/core/Tooltip';
import Image from 'react-bootstrap/Image'
import { firebaseStorage } from '../../utils/firebaseUtils'
import { Animated } from "react-animated-css";

function LoaderLogin(props) {
    const styleLoader = {
        position: 'absolute'
    };
    return (
        <div className={!props.submit ? "hidden" : ""} style={styleLoader}>
            <Loader type="Rings" color="#00BFFF" height="50" width="50" />
        </div>
    );
}


var workShop;

class WorkShop extends Component {

    constructor(props) {
        super(props);

        this.state = {
            buttonIsDisable: false,
            image: '',
            progress: 100,
            animationVisible: true
        };

        this.onDrop = this.onDrop.bind(this);
    }

    popularWorkShopProduto() {
        workShop = {
            _id: this.props.this.state.idWorkShop,
            produtos: this.props.this.state.dataProduto
        }
    }

    handlerAddProduto() {
        if (document.querySelector('#formModalProduto').reportValidity()) {
            if (this.props.this.state.idProduto !== '') {
                const data = this.props.this.state.dataProduto;
                const index = data.indexOf(this.props.this.state.oldDataProduto);

                var newValor;
                if (this.props.this.state.oldDataProduto.valor !== this.props.this.state.valorProduto) {
                    newValor = parseFloat(this.props.this.state.valorProduto.replace('R$ ', '').replace('.', '').replace(',', '.'))
                } else {
                    newValor = this.props.this.state.oldDataProduto.valor
                }

                var newData = {
                    id: this.props.this.state.oldDataProduto.idProduto,
                    name: this.props.this.state.nomeProduto,
                    descricao: this.props.this.state.descricaoProduto,
                    imageUrl: this.props.this.state.urlImageProduto,
                    valor: newValor
                };

                data[index] = newData;
                this.props.this.setState({ dataProduto: data })
            } else {
                const data = this.props.this.state.dataProduto;
                var newData = {
                    name: this.props.this.state.nomeProduto,
                    descricao: this.props.this.state.descricaoProduto,
                    imageUrl: this.props.this.state.urlImageProduto,
                    valor: parseFloat(this.props.this.state.valorProduto.replace('R$ ', '').replace('.', '').replace(',', '.'))
                };
                data.push(newData);
                this.props.this.setState({ dataProduto: data })
            }
            this.handlerUpdateOficinaProduto();
        }

    }

    handlerUpdateOficinaProduto() {
        this.popularWorkShopProduto();
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
                    this.handleCloseProduto();
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

    handleCloseProduto() {
        this.setState({
            animationVisible: false
        });
        setTimeout(() => {
            this.props.this.setState({
                idProduto: '',
                nomeProduto: '',
                valorProduto: '',
                urlImageProduto: '',
                openModalProduto: false,
                descricaoProduto: '',
            });
        }, 800);
    }

    onUpload() {
        document.getElementById("fileInputModalProduto").click()
    }

    onDrop() {
        var file = document.querySelector('#fileInputModalProduto').files[0]; //sames as here
        let reader = new FileReader();
        reader.onload = () => {
            var urlImageBackup = this.props.this.state.urlImageProduto;
            this.setState({ image: reader.result, buttonIsDisable: true, });
            this.props.this.setState({ urlImageProduto: '' });
            var uploadTask = firebaseStorage.ref('/Fotos/Produtos').child(localStorage.getItem('infoUser') + file.name).putString(this.state.image, 'data_url', { contentType: file.type });

            uploadTask.on('state_changed', (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.setState({
                    progress: progress,
                });
                console.log('Upload is ' + progress + '% done');
            }, (error) => {
                ToastsStore.error('Ops!! Erro ao salvar imagem no servidor')
                this.setState({ buttonIsDisable: false });
                this.props.this.setState({ urlImageProduto: urlImageBackup });
                console.log(error)
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    this.props.this.setState({
                        urlImageProduto: downloadURL
                    });
                    this.setState({
                        buttonIsDisable: false
                    });
                });
            });

        };
        reader.readAsDataURL(file);
    }

    render() {
        return (
            <div id='modal'>
                <Animated animationIn="bounceIn" animationOut="bounceOut" isVisible={this.state.animationVisible}>
                    <div id='modal'>
                        <form id="formModalProduto">
                            <AppBar>
                                <Toolbar>
                                    <Typography variant="h6">Produtos Oferecidos</Typography>
                                </Toolbar>
                            </AppBar>
                            <div id='container-modal' style={{ paddingTop: "30px" }}>
                                <div id='container-fileds-modal'>
                                    <Tooltip title="Adicionar Foto">
                                        <Fab disabled={this.state.buttonIsDisable} style={{ minHeight: '170px', minWidth: '170px', borderRadius: '50%' }} onClick={() => this.onUpload()}>
                                            <LoaderLogin submit={this.state.buttonIsDisable} />
                                            <Image src={this.props.this.state.urlImageProduto} roundedCircle style={{ maxHeight: '170px', maxWidth: '169px', minHeight: '170px', borderRadius: '66%' }} />
                                            <input type="file" id="fileInputModalProduto" style={{ display: "none" }} accept=".jpe, .png, .jpeg" onChange={() => this.onDrop()} />
                                        </Fab>
                                    </Tooltip>
                                    {this.state.progress !== 100 && <CircularProgress variant="static" style={{
                                        width: '165px',
                                        height: '0px !important',
                                        transform: 'rotate(-90deg)',
                                        position: 'absolute',
                                        left: '33px',
                                        top: '92px',
                                        zIndex: 1,
                                        color: "#6ec2d7"
                                    }}
                                        value={this.state.progress} />
                                    }
                                </div>
                                <div id='container-fileds-modal'>
                                    <MuiThemeProvider>
                                        <div>
                                            <TextField
                                                placeholder="Serviço"
                                                required
                                                error={this.props.this.state.nomeProduto !== "" || !this.props.this.state.validNomeProduto ? false : true}
                                                onChange={({ target: { value } }) => {
                                                    this.props.this.setState({
                                                        nomeProduto: value,
                                                        validNomeProduto: value !== ""
                                                    });
                                                }
                                                }
                                                value={this.props.this.state.nomeProduto}
                                                onBlur={({ target: { value } }) => {
                                                    this.props.this.setState({
                                                        validNomeProduto: true
                                                    });
                                                }
                                                }
                                                value={this.props.this.state.nomeProduto}
                                                helperText={this.props.this.state.nomeProduto !== "" || !this.props.this.state.validNomeProduto ? "" : "Campo Obrigatório!"}
                                                label="Oficina"
                                                margin="normal"
                                                style={{ width: '350px' }}
                                            />
                                        </div>
                                        <div id='field'>
                                            <label id="field">Valor</label>
                                            <div id='after-label'></div>
                                            <CurrencyInput
                                                className="currency-field"
                                                prefix="R$ "
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                value={this.props.this.state.valorProduto}
                                                onChangeEvent={({ target: { value } }) => {
                                                    this.props.this.setState({
                                                        valorProduto: value,
                                                        validNomeProduto: value !== ""
                                                    });
                                                }
                                                }
                                            />
                                            <div>
                                                <hr aria-hidden="true" id='linha-field-1'></hr>
                                                <hr aria-hidden="true" id='linha-field-2'></hr>
                                            </div>
                                        </div>
                                    </MuiThemeProvider>
                                </div>
                                <div id='container-fileds-modal'>
                                    <MuiThemeProvider>
                                        <div>
                                            <TextField
                                                id="standard-multiline-flexible"
                                                label="Descrição"
                                                multiline
                                                rowsMax="5"
                                                margin="normal"
                                                style={{ width: "300px" }}
                                                onChange={({ target: { value } }) => {
                                                    this.props.this.setState({
                                                        descricaoProduto: value,
                                                        validDescricaoProduto: value !== ""
                                                    });
                                                }
                                                }
                                                value={this.props.this.state.descricaoProduto}
                                            />
                                        </div>
                                    </MuiThemeProvider>
                                </div>
                            </div>
                            <div id="container-btn-modal">
                                <Fab
                                    aria-label="Save"
                                    onClick={() => this.handlerAddProduto()}
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
                                    onClick={() => this.handleCloseProduto()}
                                    style={{ borderRadius: '50%', backgroundColor: "#F44336" }}
                                >
                                    <CloseIcon style={{ color: "white" }} />
                                </Fab>
                            </div>
                        </form>
                    </div>
                </Animated >
            </div>
        );
    }
}

export default WorkShop;
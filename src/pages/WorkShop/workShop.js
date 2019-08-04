import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import ApiService from '../../services/ApiService';
import FirebaseUpload from '../../services/FirebaseUpload'
import Image from 'react-bootstrap/Image'
import './styles.css';
import Tooltip from '@material-ui/core/Tooltip';
import Loader from 'react-loader-spinner';
import TextField from '@material-ui/core/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import InputMask from 'react-input-mask'
import SaveIcon from '@material-ui/icons/Save';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import { green } from '@material-ui/core/colors';
import MaterialTable from 'material-table';
import Modal from '@material-ui/core/Modal';
import ModalServices from './modalServicesWorkShop'
import ModalProdutos from './modalProdutosWorkShop'
import LogoMyCodeDev from '../../imgs/devlogo_xcZ_1.ico'
import MaskedInput from 'react-text-mask';
import MaskCnpj from '../../utils/maskCnpj'
import MaskCellPhone from '../../utils/maskCellPhone'
import MaskPhone from '../../utils/maskPhone'
import ValidarCnpj from '../../utils/validacao/validarCnpj'

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
            //Oficina
            imagemWorkShop: '',
            urlImageBackup: '',
            nameImage: '',
            image: '',
            buttonIsDisable: false,
            idWorkShop: '',
            workShopName: '',
            validworkShopName: false,
            razaoSocial: '',
            validRazaoSocial: false,
            workCnpj: '',
            validCnpj: false,
            telefoneFixo: '',
            cellPhone: '',
            success: false,
            loading: false,
            error: false,
            progress: 100,
            errored: false,
            //Servicos
            openModal: false,
            idServico: '',
            nomeServico: '',
            valorServico: '',
            loadingTableService: false,
            oldDataService: '',
            validNomeServico: false,
            validValorServico: false,
            columns: [
                { title: 'Serviço', field: 'name' },
                {
                    title: 'Valor',
                    field: 'valor',
                    type: 'currency',
                    currencySetting: { locale: 'pt-BR', currencyCode: 'BRL' }
                }
            ],
            data: [],
            //Produtos
            openModalProduto: false,
            idProduto: '',
            nomeProduto: '',
            validNomeProduto: false,
            descricaoProduto: '',
            urlImageProduto: '',
            valorProduto: '',
            oldDataProduto: '',
            loadingTableProduto: false,
            columnsProduto: [
                { title: '', field: 'imageUrl', render: rowData => <img src={rowData.imageUrl} style={{ width: 40, borderRadius: '50%' }} /> },
                { title: 'Produto', field: 'name' },
                {
                    title: 'Valor',
                    field: 'valor',
                    type: 'currency',
                    currencySetting: { locale: 'pt-BR', currencyCode: 'BRL' }
                },
                { title: 'Descrição', field: 'descricao' },
            ],
            dataProduto: [],

            //GERAL
            successButtonModal: false,
            errorButtonModal: false,
        }
        // this.onDrop = this.onDrop.bind(this);

        this.getDadosOficina();
    }

    getDadosOficina() {
        ApiService.get('/userFirebase/' + localStorage.getItem('infoUser')).then(
            user => {
                ApiService.get('/workShop/' + user.data[0].workShops[0]._id).then(
                    workShop => {
                        this.setState({
                            idWorkShop: workShop.data._id,
                            workShopName: workShop.data.nameFantasy,
                            razaoSocial: workShop.data.socialReason,
                            workCnpj: workShop.data.cnpj,
                            telefoneFixo: workShop.data.phone,
                            cellPhone: workShop.data.cellPhone,
                            imagemWorkShop: workShop.data.urlImage,
                            data: workShop.data.service !== undefined ? workShop.data.service : [],
                            dataProduto: workShop.data.produtos !== undefined ? workShop.data.produtos : [],
                            nameImage: workShop.data.nameImage
                        });
                        this.popularWorkShop();
                    }

                ).catch(
                    error => {
                        ToastsStore.error('Ops!! Erro ao carregar dados da oficina')
                        console.log(error)
                    }
                );
            }
        ).catch(
            error => {
                ToastsStore.error('Ops!! Erro ao carregar dados de usuário')
                console.log(error)
            }
        );
    }

    onDrop(fileInput, ToastsStore) {
        FirebaseUpload.onDrop(fileInput, this, ToastsStore).then(
            () => {
                this.setImage();
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
    }

    setImage() {
        console.log('SALVANDO IMAGE NO MONGO');
        const workShop = {
            urlImage: this.state.imagemWorkShop
        };
        console.log(this.state.imagemWorkShop);
        ApiService.put('/workShopUpdateByUserFirebse/' + localStorage.getItem('infoUser'), workShop).then(
            () => {
                ToastsStore.success('Imagem salva com sucesso!!')
                this.setState({ buttonIsDisable: false });
            }
        ).catch(
            reject => {
                ToastsStore.error('Ops!! Erro ao salvar imagem')
                this.setState({ buttonIsDisable: false });
                console.log(reject)
            }
        );
    }

    popularWorkShop() {
        workShop = {
            _id: this.state.idWorkShop,
            nameFantasy: this.state.workShopName,
            socialReason: this.state.razaoSocial,
            cnpj: this.state.workCnpj,
            phone: this.state.telefoneFixo,
            cellPhone: this.state.cellPhone,
            urlImage: this.state.imagemWorkShop,
            nameImage: this.state.nameImage,
        }
    }

    popularWorkShopServicesProduto() {
        workShop = {
            _id: this.state.idWorkShop,
            service: this.state.data,
            produtos: this.state.dataProduto
        }
    }

    handlerUpdateOficina(event) {
        if (document.querySelector('#formWorkShop').reportValidity() && this.formValidate()) {
            this.setState({
                success: false,
                loading: true,
            });
            this.updateOficina();
        }
    }

    formValidate(){
        return ValidarCnpj.validarCNPJ(this.state.workCnpj);
    }

    updateOficina() {
        this.popularWorkShop();
        ApiService.put('/workShop/' + workShop._id, workShop).then(
            () => {
                ToastsStore.success('Dados registrados com sucesso!!')
                this.setState({
                    success: true,
                    loading: false,
                });
                setTimeout(() => {
                    this.setState({
                        success: false,
                        loading: false,
                    });
                }, 2000);
            }
        ).catch(
            error => {
                ToastsStore.error('Ops!! Erro ao salvar seus dados')
                console.log(error)
                this.setState({
                    success: false,
                    loading: false,
                    error: true,
                });
                setTimeout(() => {
                    this.setState({
                        success: false,
                        loading: false,
                        error: false,
                    });
                }, 2000);
            }
        );
    }

    onUpload() {
        document.getElementById("fileInputOficina").click()
    }

    handlerOpenModal(data) {
        if (data) {
            this.setState({
                idServico: data.id,
                nomeServico: data.name,
                valorServico: data.valor,
                oldDataService: data
            });
        }
        this.setState({ openModal: true });
    }

    handleClose() {
        this.setState({
            idServico: '',
            nomeServico: '',
            valorServico: '',
            openModal: false
        });
    }

    handlerRemoveOficinaServices(rowData) {
        this.setState({
            loadingTableService: true,
        });
        const data = this.state.data;
        data.splice(data.indexOf(rowData), 1);
        this.setState({ data: data });
        this.popularWorkShopServicesProduto();
        ApiService.put('/workShop/' + workShop._id, workShop).then(
            () => {
                this.setState({
                    loadingTableService: false,
                });
                setTimeout(() => {
                    this.setState({
                        loadingTableService: false,
                    });
                }, 2000);
                ToastsStore.success('Dado removido com sucesso!!')
            }
        ).catch(
            error => {
                this.setState({
                    loadingTableService: false,
                });
                ToastsStore.error('Ops!! Erro ao remover seus dados')
                console.log(error)
            }
        );
    }

    handlerOpenModalProduto(data) {
        if (data) {
            this.setState({
                idProduto: data.id,
                nomeProduto: data.name,
                valorProduto: data.valor,
                descricaoProduto: data.descricao,
                urlImageProduto: data.imageUrl,
                oldDataProduto: data
            });
        }
        this.setState({ openModalProduto: true });
    }

    handlerRemoveOficinaProduto(rowData) {
        this.setState({
            loadingTableProduto: true,
        });
        const data = this.state.dataProduto;
        data.splice(data.indexOf(rowData), 1);
        this.setState({ dataProduto: data });
        this.popularWorkShopServicesProduto();
        ApiService.put('/workShop/' + workShop._id, workShop).then(
            () => {
                this.setState({
                    loadingTableProduto: false,
                });
                setTimeout(() => {
                    this.setState({
                        loadingTableProduto: false,
                    });
                }, 2000);
                ToastsStore.success('Dado removido com sucesso!!')
            }
        ).catch(
            error => {
                this.setState({
                    loadingTableProduto: false,
                });
                ToastsStore.error('Ops!! Erro ao remover seus dados')
                console.log(error)
            }
        );
    }

    onErrorImage = () => {
        this.setState({ imagemWorkShop: LogoMyCodeDev });
    }

    render() {
        return (
            <form id="formWorkShop">
                <div style={{ paddingLeft: "10px", paddingTop: "10px", paddingRight: "10px" }}>
                    <Modal
                        open={this.state.openModal}
                        onClose={() => this.handleClose()}
                    >
                        <ModalServices this={this} />
                    </Modal>
                    <Modal
                        open={this.state.openModalProduto}
                        onClose={() => this.handleCloseProduto()}
                    >
                        <ModalProdutos this={this} />
                    </Modal>
                    <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} store={ToastsStore} />
                    <Grid container spacing={1} style={{ flexGrow: 1 }}>
                        <Grid item xs={12}>
                            <div id="container-oficina">
                                <div id="container-btnImagem">
                                    <Tooltip title="Adicionar Foto">
                                        <Fab disabled={this.state.buttonIsDisable} style={{ minHeight: '170px', minWidth: '170px', borderRadius: '50%' }} onClick={() => this.onUpload()}>
                                            <LoaderLogin submit={this.state.buttonIsDisable} />
                                            <Image src={this.state.imagemWorkShop} roundedCircle style={{ maxHeight: '170px', maxWidth: '169px', minHeight: '170px', borderRadius: '66%' }} onError={
                                                () => this.onErrorImage()
                                            } />
                                            <input type="file" id="fileInputOficina" style={{ display: "none" }} accept=".jpe, .png, .jpeg" onChange={() => this.onDrop('fileInputOficina', ToastsStore)} />
                                        </Fab>
                                    </Tooltip>
                                    {this.state.progress !== 100 && <CircularProgress variant="static" style={{
                                        width: '165px',
                                        height: '0px !important',
                                        transform: 'rotate(-90deg)',
                                        position: 'absolute',
                                        left: '24px',
                                        top: '86px',
                                        zIndex: 1,
                                        color: "#6ec2d7"
                                    }}
                                        value={this.state.progress} />
                                    }
                                </div>


                                <div id="container-fileds">
                                    <MuiThemeProvider>
                                        <div>
                                            <TextField
                                                placeholder="Digite o nome da oficina"
                                                required
                                                error={this.state.workShopName !== "" ? false : true}
                                                onChange={({ target: { value } }) => {
                                                    this.setState({
                                                        workShopName: value
                                                    });
                                                }
                                                }
                                                helperText={this.state.workShopName !== "" ? "" : "Campo Obrigatório!"}
                                                value={this.state.workShopName}
                                                label="Oficina"
                                                margin="normal"
                                                style={{ width: '350px' }}
                                            />
                                            <br />
                                            <TextField
                                                placeholder="Digite a razão social"
                                                required
                                                error={this.state.razaoSocial !== "" ? false : true}
                                                onChange={({ target: { value } }) => {
                                                    this.setState({
                                                        razaoSocial: value
                                                    });
                                                }
                                                }
                                                value={this.state.razaoSocial}
                                                helperText={this.state.razaoSocial !== "" ? "" : "Campo Obrigatório!"}
                                                label="Razão social"
                                                margin="normal"
                                                style={{ width: '350px' }}
                                            />
                                        </div>
                                    </MuiThemeProvider>
                                </div>

                                <div id="container-fileds">
                                    <MuiThemeProvider>
                                        <div>
                                            <TextField
                                                placeholder="Digite o CNPJ da oficina"
                                                required
                                                label="CNPJ"
                                                InputProps={{
                                                    inputComponent: MaskCnpj,
                                                }}
                                                error={this.state.workCnpj !== "" ? !ValidarCnpj.validarCNPJ(this.state.workCnpj) : true}
                                                helperText={this.state.workCnpj === "" ? "Campo Obrigatório!" : !ValidarCnpj.validarCNPJ(this.state.workCnpj) ? "CNPJ Inválido" : ""}
                                                onChange={({ target: { value } }) => {
                                                    this.setState({
                                                        workCnpj: value
                                                    });
                                                }
                                                }
                                                margin="normal"
                                                value={this.state.workCnpj}
                                            />
                                            <br />
                                            <TextField
                                                placeholder="Digite o Telefone da oficina"
                                                label="Telefone"
                                                InputProps={{
                                                    inputComponent: MaskPhone,
                                                }}
                                                onChange={({ target: { value } }) => {
                                                    this.setState({
                                                        telefoneFixo: value
                                                    });
                                                }
                                                }
                                                margin="normal"
                                                value={this.state.telefoneFixo}
                                            />
                                        </div>
                                    </MuiThemeProvider>
                                </div>
                                <div id="container-fileds">
                                    <MuiThemeProvider>
                                        <div>
                                            <TextField
                                                placeholder="Digite o Celular da oficina"
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
                                                value={this.state.cellPhone}
                                            />
                                        </div>
                                    </MuiThemeProvider>
                                </div>
                            </div>
                            <div id='container-btnRegistrar'>
                                <Fab
                                    aria-label="Save"
                                    onClick={(event) => this.handlerUpdateOficina(event)}
                                    style={{ borderRadius: '50%', backgroundColor: this.state.success ? green[500] : this.state.error ? "#F44336" : "#6EC2D7" }}
                                >
                                    {this.state.success ? <CheckIcon style={{ color: "white" }} /> : this.state.error ? <ErrorIcon style={{ color: "white" }} /> : <SaveIcon style={{ color: "white" }} />}
                                    {this.state.loading && <CircularProgress size={68} style={{
                                        position: 'absolute',
                                        top: '-9.9%',
                                        zIndex: 1,
                                        color: green[500]
                                    }} />}
                                </Fab>
                            </div>


                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <div id="container-servicos">
                                <MaterialTable
                                    style={{ position: 'initial', width: '99%' }}
                                    title="Serviços Oferecidos"
                                    columns={this.state.columns}
                                    data={this.state.data}
                                    isLoading={this.state.loadingTableService}
                                    actions={[
                                        {
                                            icon: 'edit',
                                            tooltip: 'Editar',
                                            onClick: (event, rowData) => {
                                                console.log(rowData);
                                                this.handlerOpenModal(rowData)
                                            }
                                        },
                                        () => ({
                                            icon: 'delete',
                                            tooltip: 'Remover',
                                            onClick: (event, rowData) => {
                                                this.handlerRemoveOficinaServices(rowData)
                                            }
                                        }),
                                        {
                                            icon: 'add',
                                            tooltip: 'Adicionar Serviço',
                                            isFreeAction: true,
                                            onClick: () => {
                                                this.handlerOpenModal();
                                            }
                                        }
                                    ]}
                                    options={{
                                        actionsColumnIndex: -1
                                    }}
                                    localization={{
                                        toolbar: {
                                            nRowsSelected: '{0} row(s) selected',
                                            searchTooltip: 'Pesquisar',
                                            searchPlaceholder: 'Pesquisar   '
                                        },
                                        pagination: {
                                            firstTooltip: 'Primeira página',
                                            previousTooltip: 'Página anterior',
                                            nextTooltip: 'Proxima página',
                                            labelDisplayedRows: '{from}-{to} de {count}',
                                            labelRowsSelect: 'Linhas',
                                            lastTooltip: 'Última página',
                                        },
                                        header: {
                                            actions: 'Ações'
                                        },
                                        body: {
                                            emptyDataSourceMessage: 'No records to display',
                                            filterRow: {
                                                filterTooltip: 'Filter'
                                            },
                                            emptyDataSourceMessage: 'Nenhum registro adicionado',
                                            editRow: {
                                                deleteText: 'Tem certeza que deseja deletar este conteúdo?',
                                                cancelTooltip: 'Cancelar',
                                                saveTooltip: 'Salvar'
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <div id="container-produtos">
                                <MaterialTable
                                    style={{ position: 'initial', width: '99%' }}
                                    title="Produtos Oferecidos"
                                    columns={this.state.columnsProduto}
                                    data={this.state.dataProduto}
                                    isLoading={this.state.loadingTableProduto}
                                    actions={[
                                        {
                                            icon: 'edit',
                                            tooltip: 'Editar',
                                            onClick: (event, rowData) => {
                                                console.log(rowData);
                                                this.handlerOpenModalProduto(rowData)
                                            }
                                        },
                                        () => ({
                                            icon: 'delete',
                                            tooltip: 'Remover',
                                            onClick: (event, rowData) => {
                                                this.handlerRemoveOficinaProduto(rowData)
                                            }
                                        }),
                                        {
                                            icon: 'add',
                                            tooltip: 'Adicionar Produto',
                                            isFreeAction: true,
                                            onClick: () => {
                                                this.handlerOpenModalProduto();
                                            }
                                        }
                                    ]}
                                    options={{
                                        actionsColumnIndex: -1
                                    }}
                                    localization={{
                                        toolbar: {
                                            nRowsSelected: '{0} row(s) selected',
                                            searchTooltip: 'Pesquisar',
                                            searchPlaceholder: 'Pesquisar   '
                                        },
                                        pagination: {
                                            firstTooltip: 'Primeira página',
                                            previousTooltip: 'Página anterior',
                                            nextTooltip: 'Proxima página',
                                            labelDisplayedRows: '{from}-{to} de {count}',
                                            labelRowsSelect: 'Linhas',
                                            lastTooltip: 'Última página',
                                        },
                                        header: {
                                            actions: 'Ações'
                                        },
                                        body: {
                                            emptyDataSourceMessage: 'No records to display',
                                            filterRow: {
                                                filterTooltip: 'Filter'
                                            },
                                            emptyDataSourceMessage: 'Nenhum registro adicionado',
                                            editRow: {
                                                deleteText: 'Tem certeza que deseja deletar este conteúdo?',
                                                cancelTooltip: 'Cancelar',
                                                saveTooltip: 'Salvar'
                                            }
                                        }
                                    }}
                                />

                            </div>
                        </Grid>
                    </Grid>
                </div >
            </form>
        );
    }
}

export default WorkShop;
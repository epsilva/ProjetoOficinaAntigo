import { firebaseStorage } from '../utils/firebaseUtils';

async function uploadImageFireBase(reader, file, model, toast) {
    return new Promise(function(resolve, reject){
        var uploadTask = firebaseStorage.ref('/Fotos').child(localStorage.getItem('infoUser') + file.name).putString(model.state.image, 'data_url', { contentType: file.type });
        
        uploadTask.on('state_changed', (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            model.setState({
                progress: progress
            });
            console.log('Upload is ' + progress + '% done');
        }, (error) => {
            toast.error('Ops!! Erro ao salvar imagem no servidor')
            model.setState({ buttonIsDisable: false, imagemWorkShop: model.state.urlImageBackup });
            console.log(error)
            reject(error)
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                model.setState({ imagemWorkShop: downloadURL, nameImage: localStorage.getItem('infoUser') + file.name, buttonIsDisable: false });
                resolve(downloadURL);
            });
        }); 
    });
}

export default class FirebaseUpload {

    static onDrop(filiInput, model, toast) {
        return new Promise(function (resolve, reject) {
            var file = document.querySelector('#' + filiInput).files[0]; //sames as here
            let reader = new FileReader();
            reader.onload = () => {
                model.setState({ image: reader.result, buttonIsDisable: true, imagemWorkShop: '' });
                firebaseStorage.ref('/Fotos/' + model.state.nameImage).delete().then(
                    () => {
                        uploadImageFireBase(reader, file, model, toast).then(
                            result => {
                                resolve(result);
                            }
                        ).catch(
                            error => {
                                reject(error)
                            }
                        )
                    }
                ).catch(
                    (error) => {
                        console.log(error)
                        if (error.code === 'storage/object-not-found') {
                            uploadImageFireBase(reader, file, model, toast).then(
                                result => {
                                    resolve(result);
                                }
                            ).catch(
                                error => {
                                    reject(error)
                                }
                            )
                        } else {
                            toast.error('Ops!! Erro ao salvar imagem no servidor')
                            reject(error)
                        }
                    }
                );

            };
            reader.readAsDataURL(file);
        });

    }

}
import { firebaseImpl } from '../utils/firebaseUtils'

function loginError(error, toast) {
    if (error.code === 'auth/invalid-email') {
        toast.error("Formato do E-mail Inválido \n O e-mail informado não é válido. Exemplo: exemplo@exemplo.com");
    }
    if (error.code === 'auth/user-not-found') {
        toast.error("E-mail não cadastrado \n Registre-se antes de inicar no App.");
    }
    if (error.code === 'auth/wrong-password') {
        toast.error("Dados incorretos \n E-mail e/ou senha incorretos.");
    }
    if (error.code === 'auth/weak-password') {
        toast.error("Senha Fraca \n Senha deve conter no mínimo 6 caracteres.");
    }
    if (error.code === 'auth/email-already-in-use') {
        toast.error("E-mail em uso \n Este e-mail já está sendo usado.");
    }
}

export default class FirebaseService {

    static signOut() {
        return new Promise(function (resolve, reject) {
            firebaseImpl.auth().signOut().then(result => {
                console.log('SingOut')
                localStorage.setItem('infoUser', undefined);
                resolve(result)
            }).catch(error => {
                reject(error)
            });
        });
    };

    static async verifyUserLogin() {
        return new Promise(function (resolve, reject) {
            firebaseImpl.auth().onAuthStateChanged(function (user) {
                if (user) {
                    resolve(user);
                } else {
                    reject('Não Logado');
                }
            });
        });
    }

    static verifyIdToken(uid) {
        return uid !== 'undefined';
    }

    static loginWithEmailAndPassword(state, toast) {
        return new Promise(function (resolve, reject) {
            firebaseImpl.auth().signInWithEmailAndPassword(state.email, state.password).then(
                result => {
                    resolve(result);
                }
            ).catch(
                error => {
                    loginError(error, toast)
                    reject(error);
                }
            );
        });

    };

    static createUserWithEmailAndPassword(state, toast) {
        return new Promise(function (resolve, reject) {
            firebaseImpl.auth().createUserWithEmailAndPassword(state.email, state.password).then(
                result => {
                    resolve(result);
                }
            ).catch(
                error => {
                    loginError(error, toast)
                    reject(error);
                }
            );
        });
    }

}
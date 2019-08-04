export default class ValidarEmail {

    static validarEmail(email) {
        if(email === ""){
            return true
        }
        return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    }

}
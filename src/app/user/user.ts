export class user{
    nombre:string
    email:string
    pwd1:string
    pwd2:string
    id:string
    paidMatches:number

    constructor(){
        this.id=""
        this.nombre=""
        this.email=""
        this.pwd1=""
        this.pwd2=""
        this.paidMatches=0
    }
    datosRegistro(nombre:string ,email:string, pwd1:string, pwd2:string){
        this.nombre=nombre
        this.email=email
        this.pwd1=pwd1
        this.pwd2=pwd2
    }

    datosLogin(email:string,pwd1:string){
        this.email=email
        this.pwd1=pwd1
    }

    datosRecuperar(email:string) {
        this.email=email
    }

    datosCambiar(pwd1:string, pwd2:string) {
        this.pwd1=pwd1
        this.pwd2=pwd2
    }
}
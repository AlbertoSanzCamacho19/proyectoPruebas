export class user{
    nombre:string
    email:string
    pwd1:string
    pwd2:string

    constructor(){
        this.nombre=""
        this.email=""
        this.pwd1=""
        this.pwd2=""
    }
    datosRegistro(nombre:string ,email:string, pwd1:string, pwd2:string){
        this.nombre=nombre
        this.email=email
        this.pwd1=pwd1
        this.pwd2=pwd2
    }
}
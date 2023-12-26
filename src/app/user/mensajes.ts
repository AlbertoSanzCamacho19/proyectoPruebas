export class mensajes{
    nombre:string
    mensajes:string[]=['Mensaje1','Mensaje2','Mensaje3'];

    constructor(nombre:string){
        this.nombre=nombre
    }
    public getNombre():string{
        return this.nombre
    }
    public getMensajes():string[]{
        return this.mensajes
    }
    public setMensaje(mensaje:string){
        this.mensajes.push(mensaje)
    }
}
export class raya{
    celdas:string[][]
    id?:string
    jugadorNombre:string=""
    rivalNombre:string=""
    ciudad:string=""
    ciudadRival=""
    tiempo=0
    tiempoRival=0
    victorias=0
    victoriasRival=0
    derrotas=0
    derrotasRival=0
    empates=0
    empatesRival=0
    toca:string=""
    fichas=0

    

    constructor(){
        this.celdas=[['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','','']]
    }
}
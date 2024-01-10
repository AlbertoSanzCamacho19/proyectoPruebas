export class ahorcado{
    id?:string
    jugadorNombre:string=""
    rivalNombre:string=""
    palabraJugador:string[]=[]
    palabraRival:string[]=[]
    toca:boolean=false
    vidas=0
    vidasRival=0
    palabraVacia:string[]=[]
    palabraVaciaRival:string[]=[]
    constructor(){}
}
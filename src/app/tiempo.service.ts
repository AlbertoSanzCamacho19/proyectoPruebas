import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TiempoService {
  title = 'clase';
  position? :GeolocationPosition
  max:number=0
  min:number=0
  media:number=0
  ciudad:string=""
  constructor() { }

  
  public obtenerElTiempo(position ?:GeolocationPosition):number{
    this.position=position
    let self=this
    let latitud=this.position?.coords?.latitude
    console.log(latitud)
    let url="https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/38.9903762%2C%20-3.9203192?unitGroup=metric&include=current&key=G94RAC9R3W3GNMLK7B9B8Q24B&contentType=json"
    let req=new XMLHttpRequest();

    req.onreadystatechange=function(){
      if(this.readyState==4){
        if(this.status>=200 && this.status<400){
          //todo ok
          console.log("tiempo accedido con exito")
          let response=req.response
          response=JSON.parse(response)
          
           self.max=response.days[0].tempmax
           self.min=response.days[0].tempmin
           self.media=(self.min+self.max)/2
        }
        else{
          console.log("Error de peticion")
        }
      }
      
    }
    req.open("GET",url)
    req.send()
    return 0
  }

  public obtenerCiudad(position? :GeolocationPosition):string{
    this.position=position
    let self=this
    let latitud=this.position?.coords?.latitude
    console.log(latitud)
    let url="https://nominatim.openstreetmap.org/reverse?lat=38.9903762&lon=-3.9203192&format=json"
    let req=new XMLHttpRequest();

    req.onreadystatechange=function(){
      if(this.readyState==4){
        if(this.status>=200 && this.status<400){
          //todo ok
          console.log("ciudad accedida con exito")
          let response=req.response
          response=JSON.parse(response)
          
           self.ciudad=response.address.city
        }
        else{
          console.log("Error de peticion")
        }
      }
    }
    
    req.open("GET",url)
    req.send()
    return self.ciudad
  }
}

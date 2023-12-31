import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'clase';
  position? :GeolocationPosition
  max?:number
  min?:number
  ciudad?:string

  constructor(private router: Router){

    navigator.geolocation.getCurrentPosition(
      position=>{
        this.position=position
      },
      error=>{
        console.log("error al obtener la posicion")
      }
      )
      this.obtenerElTiempo();
      this.obtenerCiudad();
  }

  // Establecer la ventana al iniciar la aplicación
  /*ngOnInit() {
    this.router.navigate(['Login']);
  }*/

  private obtenerElTiempo(){
    let self=this
    let latitud=this.position?.coords?.latitude
    console.log(latitud)
    let url="https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/38.9903762%2C%20-3.9203192?unitGroup=metric&include=current&key=G94RAC9R3W3GNMLK7B9B8Q24B&contentType=json"
    let req=new XMLHttpRequest();

    req.onreadystatechange=function(){
      if(this.readyState==4){
        if(this.status>=200 && this.status<400){
          //todo ok
          let response=req.response
          response=JSON.parse(response)
          
           self.max=response.days[0].tempmax
           self.min=response.days[0].tempmin
        }
        else{
          console.log("Error de peticion")
        }
      }
    }
    
    req.open("GET",url)
    req.send()
  }

  private obtenerCiudad(){
    let self=this
    let latitud=this.position?.coords?.latitude
    let url="https://nominatim.openstreetmap.org/reverse?lat=38.9903762&lon=-3.9203192&format=json"
    let req=new XMLHttpRequest();

    req.onreadystatechange=function(){
      if(this.readyState==4){
        if(this.status>=200 && this.status<400){
          //todo ok
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
  }
  
}

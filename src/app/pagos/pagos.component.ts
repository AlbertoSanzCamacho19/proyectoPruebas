import { Component, OnInit } from '@angular/core';
import { PagosService } from '../pagos.service';
import { UserService } from '../user.service';
declare let Stripe : any;

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit{

  exitoso:boolean=false
  amount:number=10
  transactionId?:string
  stripe=Stripe("pk_test_51OMohZGg40l4T36NEVKY3jV0UXhHid2ZoitgI75cbRpZpvY53vCBGZu3PNPQRQozbIAG9vZ5IRsvUR5u2OoAM03Q002bWwFVjE")
  service:PagosService;

  constructor(private PagosService:PagosService,private userService:UserService){
    this.service=PagosService
  }
  ngOnInit(): void {
    
  }



  requestPrepayment(){
    this.service.prepay(this.amount).subscribe({
      next:(response:any)=>{
        this.transactionId=response.body
        this.showForm()
      },
      error:(response:any)=>{
        alert(response)
      }
    })
  }

  showForm(){
    let elements=this.stripe.elements()
    let style = {
      base: {
      color: "#32325d", fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased", fontSize: "16px",
      "::placeholder": {
      color: "#32325d"
      }
      },
      invalid: {
        fontFamily: 'Arial, sans-serif', color: "#fa755a",
        iconColor: "#fa755a"
        } 
      }

      let card = elements.create("card", { style : style })
      card.mount("#card-element")
      card.on("change", function(event : any) {
      document.querySelector("button")!.disabled = event.empty;
      document.querySelector("#card-error")!.textContent = 
     event.error ? event.error.message : "";
      });
      let self = this
      let form = document.getElementById("payment-form");
      form!.addEventListener("submit", function(event) {
      event.preventDefault();
      self.payWithCard(card);
      });
      form!.style.display = "block"
     
  }
  payWithCard(card: any) {
    let self = this
    this.stripe.confirmCardPayment(this.transactionId, {
      payment_method: {
      card: card
      }
    }).then(function(response : any) {
      if (response.error) {
      alert(response.error.message);
      } else {
      if (response.paymentIntent.status === 'succeeded') {
      alert("Pago exitoso");
      self.exitoso=true
      self.service.confirm().subscribe({
      next : (response : any) => {
        let actual=self.userService.getCurrentUser().paidMatches
        self.userService.getCurrentUser().paidMatches=actual+self.amount
      alert(response)
      },
      error : (response : any) => {
      alert(response)
      }
      })
      }
      }
      });
     
  }
}

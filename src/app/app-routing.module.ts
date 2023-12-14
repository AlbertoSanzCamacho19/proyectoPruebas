import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RayaComponent } from './raya/raya.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { PagosComponent } from './pagos/pagos.component';

const routes: Routes = [
  {path:'Juegos',component: RayaComponent},
  {path:'Register',component: RegisterComponent},
  {path:'Login',component:LoginComponent},
  {path:'Pagos',component:PagosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RayaComponent } from './raya/raya.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { PagosComponent } from './pagos/pagos.component';
import { ChatComponent } from './chat/chat.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  {path:'Juegos',component: RayaComponent},
  {path:'Register',component: RegisterComponent},
  {path:'Login',component:LoginComponent},
  {path:'Pagos',component:PagosComponent},
  {path:'Chat',component:ChatComponent},
  {path:'Menu',component:MenuComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

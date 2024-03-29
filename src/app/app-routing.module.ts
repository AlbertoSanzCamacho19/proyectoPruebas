import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RayaComponent } from './raya/raya.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { PagosComponent } from './pagos/pagos.component';
import { ChatComponent } from './chat/chat.component';
import { BorrarUsuarioComponent } from './borrar-usuario/borrar-usuario.component';
import { CambioPasswordComponent } from './password/cambioPassword.component';
import { MenuComponent } from './menu/menu.component';
import { AhorcadoComponent } from './ahorcado/ahorcado.component';

const routes: Routes = [
  {path:'Juegos',component: RayaComponent},
  {path:'Register',component: RegisterComponent},
  {path:'Login',component:LoginComponent},
  {path:'Pagos',component:PagosComponent},
  {path:'Chat',component:ChatComponent},
  {path:'Menu',component:MenuComponent},
  {path:'CambioPassword',component:CambioPasswordComponent},
  {path:'Ahorcado',component:AhorcadoComponent},
  {path:'BorrarUsuario',component:BorrarUsuarioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

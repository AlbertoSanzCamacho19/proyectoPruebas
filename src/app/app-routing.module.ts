import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RayaComponent } from './raya/raya.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path:'Juegos',component: RayaComponent},
  {path:'Register',component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

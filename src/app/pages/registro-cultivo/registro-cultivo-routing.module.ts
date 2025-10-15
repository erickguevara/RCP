import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroCultivoPage } from './registro-cultivo.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroCultivoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroCultivoPageRoutingModule {}

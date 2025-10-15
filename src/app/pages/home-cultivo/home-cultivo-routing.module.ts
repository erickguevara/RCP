import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeCultivoPage } from './home-cultivo.page';

const routes: Routes = [
  {
    path: '',
    component: HomeCultivoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeCultivoPageRoutingModule {}

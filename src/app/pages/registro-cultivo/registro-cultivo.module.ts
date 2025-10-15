import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroCultivoPageRoutingModule } from './registro-cultivo-routing.module';

import { RegistroCultivoPage } from './registro-cultivo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroCultivoPageRoutingModule
  ],
  declarations: [RegistroCultivoPage]
})
export class RegistroCultivoPageModule {}

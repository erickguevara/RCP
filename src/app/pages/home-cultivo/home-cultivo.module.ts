import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeCultivoPageRoutingModule } from './home-cultivo-routing.module';

import { HomeCultivoPage } from './home-cultivo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeCultivoPageRoutingModule
  ],
  declarations: [HomeCultivoPage]
})
export class HomeCultivoPageModule {}

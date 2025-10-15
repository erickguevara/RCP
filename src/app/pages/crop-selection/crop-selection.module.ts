import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CropSelectionPageRoutingModule } from './crop-selection-routing.module';
import { CropSelectionPage } from './crop-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CropSelectionPageRoutingModule
  ],
  declarations: [CropSelectionPage]
})
export class CropSelectionPageModule {}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalqrPageRoutingModule } from './modalqr-routing.module';

import { ModalqrPage } from './modalqr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalqrPageRoutingModule
  ],
  declarations: [ModalqrPage]
})
export class ModalqrPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinfichaPageRoutingModule } from './finficha-routing.module';

import { FinfichaPage } from './finficha.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinfichaPageRoutingModule
  ],
  declarations: [FinfichaPage]
})
export class FinfichaPageModule {}

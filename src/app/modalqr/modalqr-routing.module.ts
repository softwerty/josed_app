import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalqrPage } from './modalqr.page';

const routes: Routes = [
  {
    path: '',
    component: ModalqrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalqrPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinfichaPage } from './finficha.page';

const routes: Routes = [
  {
    path: '',
    component: FinfichaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinfichaPageRoutingModule {}

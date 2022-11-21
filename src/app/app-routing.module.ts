import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate: [LoginGuard]
  },  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule)
  },
  {
    path: 'modalqr',
    loadChildren: () => import('./modalqr/modalqr.module').then( m => m.ModalqrPageModule)
  },
  {
    path: 'modalcliente',
    loadChildren: () => import('./modalcliente/modalcliente.module').then( m => m.ModalclientePageModule)
  },
  {
    path: 'finficha',
    loadChildren: () => import('./finficha/finficha.module').then( m => m.FinfichaPageModule)
  },

  // {
  //   path: 'login',
  //   loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

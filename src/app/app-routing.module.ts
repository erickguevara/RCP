import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'crop-selection',
    loadChildren: () => import('./pages/crop-selection/crop-selection.module').then( m => m.CropSelectionPageModule)
  },
  {
    path: 'registro-cultivo',
    loadChildren: () => import('./pages/registro-cultivo/registro-cultivo.module').then( m => m.RegistroCultivoPageModule)
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./pages/onboarding/onboarding.module').then( m => m.OnboardingPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

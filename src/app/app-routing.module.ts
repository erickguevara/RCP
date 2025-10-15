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
    path: 'preview',
    loadChildren: () => import('./pages/preview/preview.module').then( m => m.PreviewPageModule)
  },
  {
    path: 'insumo',
    loadChildren: () => import('./pages/insumo/insumo.module').then( m => m.InsumoPageModule)
  },
  {
    path: 'home-cultivo',
    loadChildren: () => import('./pages/home-cultivo/home-cultivo.module').then( m => m.HomeCultivoPageModule)
  },
  {
    path: 'historial',
    loadChildren: () => import('./pages/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'rotacion',
    loadChildren: () => import('./pages/rotacion/rotacion.module').then( m => m.RotacionPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

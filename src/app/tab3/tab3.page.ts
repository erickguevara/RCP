import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
   cultivos = [
    { nombre: 'Descripcion', tipo: 'Cultivo', tiempo: '5 días' },
    { nombre: 'Cultivo 01', tipo: 'arroz', tiempo: '10 días' },
    { nombre: 'cultivo 02', tipo: 'maiz', tiempo: '1 mes' },
    { nombre: 'cultivo 3', tipo: 'cerezas', tiempo: '2 meses' },
  ];
  constructor() {}

}

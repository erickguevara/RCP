import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../../services/sqlite.service';
@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: false,
})
export class HistorialPage implements OnInit {
  data: any;
  constructor(private router: Router, private sqlite: SqliteService) { }
  searchText = '';
  filtro = 'Todos';
  filtrados = [];
  historial2: any[] = [];
  historial = [
    {
      nombre: 'FOLICUR 250 EW',
      ingrediente: 'Tebuconazol',
      fecha: 'Hace 2 días',
      cultivo: 'Maíz',
      categoria: 'FUNGICIDA',
      icon: 'leaf-outline'
    },
    {
      nombre: 'KARATE ZEON 50 CS',
      ingrediente: 'Lambda-cihalotrina',
      fecha: 'Hace 5 días',
      cultivo: 'Soja',
      categoria: 'INSECTICIDA',
      icon: 'bug-outline'
    },
    {
      nombre: 'ROUNDUP MAX',
      ingrediente: 'Glifosato',
      fecha: 'Hace 9 días',
      cultivo: 'Trigo',
      categoria: 'HERBICIDA',
      icon: 'color-filter-outline'
    }
  ];
  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.data = navigation?.extras?.state?.['data'] || window.history.state.data;
    this.sqlite.readhistorial(this.data.id_campaña).then((aplicacions: any[]) => {
      this.historial2 = aplicacions;
      this.filtrados = [...this.historial2];
      console.log("Leido");
      console.log(this.historial2);
    }).catch(err => {
      console.error(err);
      console.error("Error al leer");
    })
    console.log('Datos recibidos:', this.data);
  }


  seleccionarFiltro(tipo: string) {
    this.filtro = tipo;
    this.filtrar();
  }

  filtrar() {
    this.filtrados = this.historial2.filter(item => {
      const coincideTexto =
        item.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.ingrediente.toLowerCase().includes(this.searchText.toLowerCase());

      const coincideFiltro =
        this.filtro === 'Todos' || item.categoria === this.filtro;

      return coincideTexto && coincideFiltro;
    });
  }

  goBack() {
    window.history.back();
  }
}
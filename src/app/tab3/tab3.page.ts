import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  cantidad: any;
  consulta: any;
  titledetalle: any;
  campana: any[] = [];
  constructor(private router: Router,
    private sqlite: SqliteService) { }
  ionViewWillEnter() {
    this.cargarData();
  }

  ngOnInit() {

    this.cargarData();
  }
  cargarData() {
    this.sqlite.readcamapana()
      .then((campana: any[]) => {
        this.campana = campana;

      }).catch(err => console.error(err));

    this.sqlite.countcultivo()
      .then(cantidad => {
        this.cantidad = cantidad;
        console.log('cantidad:', this.cantidad);
      }).catch(err => console.error(err));

    this.sqlite.countaplicacion()
      .then(consulta => {
        this.consulta = consulta;
        console.log('consulta:', this.consulta);
      }).catch(err => console.error(err));
  }


  datoscampana(datos: any) {
    console.log(datos);
    this.router.navigate(['/home-cultivo'], {
      state: { data: datos }
    });

  }
}

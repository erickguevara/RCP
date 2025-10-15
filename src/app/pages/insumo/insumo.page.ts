import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SqliteService } from '../../services/sqlite.service';
import { IonModal } from '@ionic/angular/common';
@Component({
  selector: 'app-insumo',
  templateUrl: './insumo.page.html',
  styleUrls: ['./insumo.page.scss'],
  standalone: false,
})
export class InsumoPage implements OnInit {
  data: any;
  datos: any;
  id_plaga: any = 0;
  recomendacio: any;
  recomendacio2: any;
  recomendacio3: any;
  maximoaplicacion: any;
  constructor(private router: Router, private navCtrl: NavController, private sqlite: SqliteService) { }
  @ViewChild('modal', { static: false }) modal!: IonModal;

  cerrar() {
    if (this.modal) {
      this.modal.dismiss();
    } else {
      console.error("El modal no está inicializado");
    }
  }
  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.data = navigation?.extras?.state?.['data'] || window.history.state.data;
    this.datos = navigation?.extras?.state?.['datos'] || window.history.state.datos;
    console.log('Datos recibidos:', this.datos);
    console.log('Datos recibidos:', this.data);
    if (this.datos) {
      this.recomendacio = 'RESISTENCIA  ' + this.data.resistencia;


      this.recomendacio2 = 'Maximo ' + this.data.numeroaplicaciones + ' aplicaciones por temporada';
      this.sqlite.readaplicaciones(this.data.id_insumo, this.datos.id_campaña).then((data: any) => {
        this.maximoaplicacion = data;
        if (data == 0) {
          this.recomendacio3 = "Primera Aplicacion Sin ningun riesgo de resistencia";
        } else if (data < this.data.numeroaplicaciones) {
          this.recomendacio3 = "Sin riesgo de resistencia";
        } else {
          this.recomendacio3 = "Riesgo de  resistencia se recomienda ver la rotación";
        }

      }).catch(err => {
        console.error(err);
        console.error("Error al leer");
      })
    }

    this.sqlite.readplagas(this.data).then((data: any[]) => {
      console.log(data);
    }).catch(err => {
      console.error(err);
      console.error("Error al leer");
    })
  }




  thiscreateAplicacion() {
    this.sqlite.createaplicacion(this.datos.id_campaña, this.data.id_insumo).then((changes) => {
      console.log(changes);
      console.log("Creado");
      this.router.navigate(['/tabs/tab3']);
    }).catch(err => {
      console.error(err);
      console.error("Error al crear");
    })
  }
  volver() {
    this.navCtrl.back();
  }
  runOtroAnalisis() {

    this.router.navigate(['/tabs/tab2'],);

  }
  verRotacion() {
    console.log(this.id_plaga);
  }
  getRiskClass(riesgo: any): string {


    if (riesgo == 3) {
      return 'bajo-card ';
    }

    if (riesgo == 2) {
      return 'medio-card'; // si quieres amarillo luego
    }

    if (riesgo == 1) {
      return 'riesgo-card'; // rojo
    }

    return '';
  }
  getRiskClasscolor(riesgo: any): string {


    if (riesgo == 3) {
      return 'success ';
    }

    if (riesgo == 2) {
      return 'warning'; // si quieres amarillo luego
    }

    if (riesgo == 1) {
      return 'danger'; // rojo
    }

    return '';
  }

}

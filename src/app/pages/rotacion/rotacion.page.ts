import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SqliteService } from '../../services/sqlite.service';
@Component({
  selector: 'app-rotacion',
  templateUrl: './rotacion.page.html',
  styleUrls: ['./rotacion.page.scss'],
  standalone: false,
})
export class RotacionPage {
constructor(private router: Router, private navCtrl: NavController, private sqlite: SqliteService) { }
  pasos = [
    "Alternar con fungicidas de Grupo 11 (Estrobilurinas)",
    "Usar fungicidas de Grupo 7 (SDHI) en siguiente aplicación",
    "No repetir triazoles por 60 días"
  ];
    volver() {
    this.navCtrl.back();
  }

}

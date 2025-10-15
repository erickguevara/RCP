import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SqliteService } from '../../services/sqlite.service';
@Component({
  selector: 'app-home-cultivo',
  templateUrl: './home-cultivo.page.html',
  styleUrls: ['./home-cultivo.page.scss'],
  standalone: false,
})
export class HomeCultivoPage implements OnInit {
  data: any;
  tipo_cultivo: any[] = [];
  cultivo: any[] = [];
  constructor(private router: Router, private navCtrl: NavController, private sqlite: SqliteService, private alertController: AlertController) { }


  dias = [15, 30, 45, 60, 75, 90];;
  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.data = navigation?.extras?.state?.['data'] || window.history.state.data;

    this.sqlite.read().then((tipo_cultivo: { id_tipo_cultivo: string; descripcion: string; imagen: string; estado: string }[]) => {
      this.tipo_cultivo = tipo_cultivo;
      console.log("Leido");
      console.log(this.tipo_cultivo);
    }).catch(err => {
      console.error(err);
      console.error("Error al leer");
    })
    this.seleecionarcultivo();
    console.log('Datos recibidos:', this.data);
  }
  irAConsultaRapida() {

     this.router.navigate(['/tabs/tab2'], {
      state: { data: this.data }
    });
  }
   irAConsultahistorial() {
    //this.router.navigate(['/tabs/tab2']);

     this.router.navigate(['/historial'], {
      state: { data: this.data }
    });
  }
  volver() {
    this.navCtrl.back();
  }
  selectCultivo(valor: any, descripcion: string) {
    this.data.id_tipo_cultivo = valor;
    this.seleecionarcultivo();
  }
  seleecionarcultivo() {
    this.sqlite.readCultivos(this.data.id_tipo_cultivo).then((cultivos: any[]) => {
      this.cultivo = cultivos;
      console.log("Leido");
      console.log(this.cultivo);
    }).catch(err => {
      console.error(err);
      console.error("Error al leer");
    })
  }
  selectCultivos(c: any) {
    this.data.id_cultivo = c;
  }

  async actualizarParcela() {
    const alert = await this.alertController.create({
      header: 'Confirmar Creacion',
      message: '¿Estás seguro de crear campaña?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Crear',
          handler: () => {
            
          },
        },
      ],
    });

    await alert.present();
  }

  async eliminarParcela() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de eliminar esta aplicación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.sqlite.deletecampana(this.data.id_campaña);
              this.router.navigate(['/tabs/tab3']);
          },
        },
      ],
    });

    await alert.present();
  }

}

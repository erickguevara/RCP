import { Component, OnInit, ViewChild } from '@angular/core';
import { trash, create, eye, add } from 'ionicons/icons';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { SqliteService } from '../../services/sqlite.service';
@Component({
  selector: 'app-registro-cultivo',
  templateUrl: './registro-cultivo.page.html',
  styleUrls: ['./registro-cultivo.page.scss'],
  standalone: false,
})
export class RegistroCultivoPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  trash = trash;
  create = create;
  eye = eye;
  add = add;
  selectedCrop: any;
  descripcion: string = '';
  fecha: string = '';
  companaCultivo: string = '';
  hectareas: string = '';
  indice: number = 0;
  modoEdicion = false;
  cultivo: any[] = [];
  public aplicacion: { descripcion: string; fecha: string; fechaformat: string; id_aplicacion: string; estado: string }[] = [];;
  constructor(private router: Router, private alertController: AlertController, private sqlite: SqliteService) {

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.selectedCrop = navigation.extras.state['selectedCrop'];
      this.sqlite.readCultivos(this.selectedCrop).then((cultivos: any[]) => {
        this.cultivo = cultivos;
        console.log("Leido");
        console.log(this.cultivo);
      }).catch(err => {
        console.error(err);
        console.error("Error al leer");
      })

    }
  }

  ngOnInit() {

  }
  abrirModal(indice: any) {
    if (indice == 0) {
      this.descripcion = '';
      this.fecha = ''
      this.indice = 0;
      this.modoEdicion = false;
    } else {
      this.descripcion = this.aplicacion[indice - 1].descripcion;
      this.fecha = this.aplicacion[indice - 1].fecha;
      this.indice = indice;
      this.modoEdicion = true;
    }
    this.modal.present();
  }
  agregar() {


    const [year, month, day] = this.fecha.split('-').map(Number);

    const fechaLocal = new Date(year, month - 1, day);
    const formatoLargo = fechaLocal.toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    if (this.indice == 0) {
      this.aplicacion.push({
        descripcion: this.descripcion,
        fecha: this.fecha,
        fechaformat: formatoLargo,
        id_aplicacion: '0',
        estado: '1'
      });
    } else {
      this.aplicacion[this.indice - 1] = {
        descripcion: this.descripcion,
        fecha: this.fecha,
        fechaformat: formatoLargo,
        id_aplicacion: '0',
        estado: '1'
      };
    }


    this.modal.dismiss();
  }

  async confirmarEliminar(index: number) {
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
            this.eliminar(index - 1);
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmarGuardado(index: number) {
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
            this.createcultivo
          },
        },
      ],
    });

    await alert.present();
  }
  eliminar(index: number) {
    this.aplicacion.splice(index, 1);
  }
  createcultivo() {
    // Creamos un elemento en la base de datos
    this.sqlite.create(this.aplicacion, this.companaCultivo, this.hectareas).then((changes) => {
      console.log(changes);
      console.log("Creado");

    }).catch(err => {
      console.error(err);
      console.error("Error al crear");
    })
  }
}

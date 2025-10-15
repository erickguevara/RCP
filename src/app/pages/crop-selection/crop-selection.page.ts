import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../../services/sqlite.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-crop-selection',
  templateUrl: './crop-selection.page.html',
  styleUrls: ['./crop-selection.page.scss'],
   standalone: false,
})
export class CropSelectionPage implements OnInit {

  paso = 1;

  tipo_cultivo: any[] = [];
  cultivo: any[] = [];
  departamentos: any[] = [];
  provincias: any[] = [];
  distritos: any[] = [];
  constructor(
    private router: Router,
    private sqlite: SqliteService
  ) {

    this.tipo_cultivo = [];
    this.cultivo = [];
  }

  tamanios = ['< 5 ha', '5-20 ha', '20-100 ha', '> 100 ha'];
  fertilizaciones = ['Orgánica', 'Química', 'Mixta'];

  seleccion = {
    tipo_cultivo: '',
    cultivo: '',
    tamano: '',
    riego: '',
    fechaSiembra: "",
    hectareas: '',
    distrito: '',
    provincia: '',
    departamento: '',
    tipo_cultivo_descripcion :'',
    cultivo_descripcion :'',
  };

  seleccionar(valor: string,descripcion:string) {
    this.seleccion.tipo_cultivo_descripcion = descripcion;
    this.seleccion.tipo_cultivo = valor;
  }
  seleccionarcultivo(valor: string, descripcion:string ) {
    this.seleccion.cultivo = valor;
    this.seleccion.cultivo_descripcion = descripcion;
  }
  esPasoValido(): boolean {
    switch (this.paso) {
      case 1:
        return this.seleccion.tipo_cultivo !== '';
      case 2:
        return this.seleccion.cultivo !== '';
      case 3:
        return this.seleccion.fechaSiembra !== '' && this.seleccion.hectareas !== '';
      case 4:
        return this.seleccion.distrito !== '' && this.seleccion.departamento !== '' && this.seleccion.provincia !== '';
      case 5:
        return true;
      default:
        return false;
    }
  }


  continuar() {
    if (this.paso < 5) {
      this.paso++;
    } else {
      console.log('Perfil final:', this.seleccion);
       this.sqlite.createCampaña(this.seleccion).then((changes) => {
      console.log(changes);
      console.log("Creado");
      this.router.navigate(['/tabs/tab3']);
    }).catch(err => {
      console.error(err);
      console.error("Error al crear");
    })
    }
    if (this.paso == 2) {
      this.sqlite.readCultivos(this.seleccion.tipo_cultivo).then((cultivos: any[]) => {
        this.cultivo = cultivos;
        console.log("Leido");
        console.log(this.cultivo);
      }).catch(err => {
        console.error(err);
        console.error("Error al leer");
      })

    }
    if (this.paso == 4) {
      this.sqlite.readDepartamento().then((departamentos: any[]) => {
        this.departamentos = departamentos;
      }).catch(err => {
        console.error(err);
        console.error("Error al leer");
      })

    }
  }
  onRegionChange() {
    this.sqlite.readprovincia(this.seleccion.departamento).then((provincias: any[]) => {
      this.provincias = provincias;

    }).catch(err => {
      console.error(err);
      console.error("Error al leer");
    })

  }
  onProvinciaChange() {
    this.sqlite.readdistrito(this.seleccion.provincia).then((distritos: any[]) => {
      this.distritos = distritos;

    }).catch(err => {
      console.error(err);
      console.error("Error al leer");
    })
  }
  atras() {
    if (this.paso > 1) this.paso--;
  }
  ionViewWillEnter() {
    this.read();
  }
  read() {
    // Leemos los datos de la base de datos
    this.sqlite.read().then((tipo_cultivo: { id_tipo_cultivo: string; descripcion: string; imagen: string; estado: string }[]) => {
      this.tipo_cultivo = tipo_cultivo;
      console.log("Leido");
      console.log(this.tipo_cultivo);
    }).catch(err => {
      console.error(err);
      console.error("Error al leer");
    })
  }

  ngOnInit() {
  }

}

import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../../services/image';
import { AlertController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SqliteService } from '../../services/sqlite.service';
import { createWorker, PSM } from 'tesseract.js';
import { IonModal, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
  standalone: false,
})
export class PreviewPage implements OnInit {
  data: any;
  imageSrc: string | null = null;
  zoomLevel: number = 1;
  insumo: any;
  isCropping: boolean = false;
  croppedImage: string | undefined;
  ocrText: string | undefined;
  ocrArray: any;
  @ViewChild('modal', { static: false }) modal!: IonModal;
  isProcessingOCR = false;
  constructor(private router: Router, private imageService: ImageService, private loadingCtrl: LoadingController, private sqlite: SqliteService, private alertController: AlertController) {

  }


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
    console.log(this.data);
  }
  ionViewWillEnter() {

    this.imageSrc = this.imageService.getImage();
  }
  goBack() {
    this.router.navigate(['/tabs/tab2']);
  }
  toggleCrop() {
    this.isCropping = !this.isCropping;
  }

  cancelCrop() {
    this.isCropping = false;
  }

  onImageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      const reader = new FileReader();
      reader.readAsDataURL(event.blob);
      reader.onload = () => {
        this.croppedImage = reader.result as string;
      };
    } else if (event.objectUrl) {
      this.croppedImage = event.objectUrl;
    }
  }


  applyCrop() {
    console.log(this.croppedImage);
    if (this.croppedImage) {
      this.imageSrc = this.croppedImage;
    }
    this.isCropping = false;
  }

  async runOCR(date: any) {
    console.log(date);
    if ((!this.imageSrc) && (date == '')) return;
    const loading = await this.loadingCtrl.create({
      message: date == '' ? 'Procesando OCR...' : 'Procesando Nombre...',
      spinner: 'crescent',
      cssClass: 'custom-loading success', // Aplica tu clase
      backdropDismiss: false
    });
    await loading.present();
    this.isProcessingOCR = true;
    this.ocrText = date == '' ? 'Procesando OCR...' : 'Procesando Nombre...';
    let cleanArray = [];
    try {
      console.log(date);
      if (date == '') {
        const worker = await createWorker('spa');
        await worker.setParameters({
          tessedit_pageseg_mode: PSM.AUTO,
        });
        const result = await worker.recognize(this.imageSrc);

        await worker.terminate();
        const text = result.data?.text || '';

        const lines = text
          .split('\n')
          .map(l => l.trim())
          .filter(l => l.length > 0);

        const singleWordLines = lines.filter(line => line.split(/\s+/).length === 1 || line.split(/\s+/).length === 2 || line.split(/\s+/).length === 3);
        console.log('Texto OCR detectado:', singleWordLines);
        this.insumo = singleWordLines[0];
        cleanArray = singleWordLines.map(word => {
          return word
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ]/g, '')
            .toUpperCase();
        }).filter(w => w.length > 0);
      } else {

        cleanArray = [date];
        this.modal.dismiss();
        this.insumo = '';
      }





      this.sqlite.readinsumo(cleanArray).then((insumo: any[]) => {

        if (insumo.length) {

          this.router.navigate(['/insumo'], {
            state: { data: insumo[0], datos: this.data }
          });

        } else {
          this.mostrarAlerta();

        }

      }).catch(err => {
        console.error(err);
        console.error("Error al leer");
      })




    } catch (err) {
      console.error('Error OCR:', err);
      this.ocrText = 'Error al procesar OCR.';
    }

    this.isProcessingOCR = false;
    await loading.dismiss();
  }
  async mostrarAlerta() {
    const alert = await this.alertController.create({
      header: 'No se encontro Insumo',
      message: '¿Deseas Ingresar Manual?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Ingresar',
          handler: () => {
            // abrir modal si existe
            if (this.modal) {
              this.modal.present();
            } else {
              console.error('El modal no está inicializado');
            }
          },
        },
      ],
    });

    await alert.present();
  }
}


import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { createWorker } from 'tesseract.js';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ImageService } from '../services/image';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page  {
  data: any;
  imagePreview: SafeResourceUrl | null = null;
  currentPhoto: string | null = null;
  constructor(private sanitizer: DomSanitizer, private router: Router, private imageService: ImageService) { }
  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });
    this.showPreview(image);
    console.log('Foto tomada:', image);
  }
  ionViewWillEnter() {
    const navigation = this.router.getCurrentNavigation();
    this.data = navigation?.extras?.state?.['data'] || window.history.state.data;
  }
  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.data = navigation?.extras?.state?.['data'] || window.history.state.data;
    console.log(this.data);
  }
  async uploadImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    this.showPreview(image);
    console.log('Imagen seleccionada:', image);
  }

  showPreview(image: Photo) {
    const imageUrl = `data:image/${image.format};base64,${image.base64String}`;
    this.imagePreview = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
    this.currentPhoto = imageUrl;
    this.confirmImage();
  }

  confirmImage() {
    if (this.currentPhoto) {
      this.imageService.setImage(this.currentPhoto);
      this.router.navigate(['/preview'], {
        state: { data: this.data }
      });
    }
  }

}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private currentImage: string | null = null;

  setImage(image: string) {
    this.currentImage = image;
  }

  getImage(): string | null {
    return this.currentImage;
  }

  clearImage() {
    this.currentImage = null;
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
register();
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: false,

})
export class OnboardingPage implements OnInit {
  swiperModules = [IonicSlides];
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  slides: any[] = [];

  constructor(private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit(): void {
    this.slides = [
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path d="M12 14.5V17.5M12 11.5H12.01M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `),
        color: "#faebd7",
        title: '¿Dudas al aplicar agroquímicos?',
        description: 'La información en las etiquetas puede ser confusa y peligrosa.',
        buttonText: 'Siguiente →',
        showSkip: true,
        click: true,
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
           <path d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z" stroke="#0054e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 16.8V9.2C3 8.0799 3 7.51984 3.21799 7.09202C3.40973 6.71569 3.71569 6.40973 4.09202 6.21799C4.51984 6 5.0799 6 6.2 6H7.25464C7.37758 6 7.43905 6 7.49576 5.9935C7.79166 5.95961 8.05705 5.79559 8.21969 5.54609C8.25086 5.49827 8.27836 5.44328 8.33333 5.33333C8.44329 5.11342 8.49827 5.00346 8.56062 4.90782C8.8859 4.40882 9.41668 4.08078 10.0085 4.01299C10.1219 4 10.2448 4 10.4907 4H13.5093C13.7552 4 13.8781 4 13.9915 4.01299C14.5833 4.08078 15.1141 4.40882 15.4394 4.90782C15.5017 5.00345 15.5567 5.11345 15.6667 5.33333C15.7216 5.44329 15.7491 5.49827 15.7803 5.54609C15.943 5.79559 16.2083 5.95961 16.5042 5.9935C16.561 6 16.6224 6 16.7454 6H17.8C18.9201 6 19.4802 6 19.908 6.21799C20.2843 6.40973 20.5903 6.71569 20.782 7.09202C21 7.51984 21 8.0799 21 9.2V16.8C21 17.9201 21 18.4802 20.782 18.908C20.5903 19.2843 20.2843 19.5903 19.908 19.782C19.4802 20 18.9201 20 17.8 20H6.2C5.0799 20 4.51984 20 4.09202 19.782C3.71569 19.5903 3.40973 19.2843 3.21799 18.908C3 18.4802 3 17.9201 3 16.8Z" stroke="#0054e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
    `),
        color: "#48a7f5ff",
        title: 'Escanea y entiende al instante',
        description: 'Dosis exactas, compatibilidades y adventencias en lenguaje claro.',
        buttonText: 'Siguiente →',
        click: true,
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
      <svg fill="#28bb50" width="80" height="80" viewBox="0 0 1024 1024" fill="none">
           <path d="M904 747H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM165.7 621.8l39.7 39.5c3.1 3.1 8.2 3.1 11.3 0l234.7-233.9 97.6 97.3a32.11 32.11 0 0 0 45.2 0l264.2-263.2c3.1-3.1 3.1-8.2 0-11.3l-39.7-39.6a8.03 8.03 0 0 0-11.3 0l-235.7 235-97.7-97.3a32.11 32.11 0 0 0-45.2 0L165.7 610.5a7.94 7.94 0 0 0 0 11.3z" stroke="#28bb50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
    `),
        color: "#c9ff04ff",
        title: 'Registra y mejora tu cultivo',
        description: 'Guarda tus applicaciones, recibe alestas y optimiza tus producción.',
        buttonText: 'Comenzar',
        click: false,
      },
    ];
  }
  onSlideChange(event: any) {
    console.log(this.swiperRef?.nativeElement.swiper.activeIndex);
    console.log('event', event);
  }
  nextSlide(stats : any) {
    const swiperInstance = this.swiperRef?.nativeElement.swiper;
    console.log(swiperInstance);
    if (swiperInstance && stats) {
      console.log(this.swiperRef);
      swiperInstance.slideNext();
    }else{ 
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    }
   
  }

  nextHome() {
    this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }
}

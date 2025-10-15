import { Component, OnInit } from '@angular/core';
import { Device } from '@capacitor/device';
import { Platform } from '@ionic/angular';
import { SqliteService } from './services/sqlite.service';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';

import { SplashScreen } from '@capacitor/splash-screen';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  public isWeb: boolean;
  public load: boolean;
  constructor(private platform: Platform,
    private sqlite: SqliteService, private router: Router) {
    this.isWeb = false;
    this.load = false;
    this.initApp();
    //this.showSplash();
    //this.checkOnboarding();
  }

  initApp() {

    this.platform.ready().then(async () => {

      // Comprobamos si estamos en web
      const info = await Device.getInfo();
      this.isWeb = info.platform == 'web';

      // Iniciamos la base de datos
      this.sqlite.init();
      // Esperamos a que la base de datos este lista
      this.sqlite.dbReady.subscribe(load => {
        this.load = load;
      })
    })

  }
  async ngOnInit() {

  }
  /*async checkOnboarding() {
    const { value } = await Preferences.get({ key: 'onboardingShown' });


    // Obtenemos la ruta actual
    const currentUrl = window.location.pathname;

    // Solo ejecutar lógica al inicio (cuando se entra a '/')
    if (currentUrl === '/' || currentUrl === '/tabs/tab1' || currentUrl === '/home') {
      if (value) {
        await Preferences.set({ key: 'onboardingShown', value: 'true' });
        this.router.navigateByUrl('/onboarding', { replaceUrl: true });
      } else {
        // Ya lo vio → ir directo al home (una sola vez)
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      }
    }
  }
  async showSplash() {
    await SplashScreen.show({
      autoHide: true,
      showDuration: 3000
    });
  }*/
}

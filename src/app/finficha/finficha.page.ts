import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from "@capacitor/core";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";

import { ModalController, NavParams, AlertController, Platform } from '@ionic/angular';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-finficha',
  templateUrl: './finficha.page.html',
  styleUrls: ['./finficha.page.scss'],
})
export class FinfichaPage implements OnInit {

  lastLocal: any;

  photo1: SafeResourceUrl;
  photo2: SafeResourceUrl;
  photo3: SafeResourceUrl;

  photo4: SafeResourceUrl;

  titulo: string;
  pagina: any;

  constructor(private sanitizer: DomSanitizer,
    private apiService: ApiService,
    private modalController: ModalController,
    private navParams: NavParams,
    public alertController: AlertController,
    private platform: Platform
    ) {
      this.platform.backButton.subscribeWithPriority(10, () => {
        console.log("back finficha");
        this.retroceder();
      });
     }

  ngOnInit() {

    this.lastLocal = this.navParams.data.ficha;
    // console.log("ficha end");
console.table(this.lastLocal);
    this.titulo = "Adjuntar Evidencia";
    this.pagina = 0;

    this.photo1 = this.lastLocal.foto1;
    this.photo2 = this.lastLocal.foto2;
    this.photo3 = this.lastLocal.foto3;
    this.photo4 = this.lastLocal.foto4;


  }

  async takePhoto(idPhoto) {
    const image = await Plugins.Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    switch (idPhoto) {
      case 1:
        this.photo1 = this.sanitizer.bypassSecurityTrustResourceUrl( image && image.dataUrl );
        this.lastLocal.foto1 = image.dataUrl;
        this.apiService.updateStorageMant(this.lastLocal);
        break;
      case 2:
        this.photo2 = this.sanitizer.bypassSecurityTrustResourceUrl( image && image.dataUrl );
        this.lastLocal.foto2 = image.dataUrl;
        this.apiService.updateStorageMant(this.lastLocal);
        break;
      case 3:
        this.photo3 = this.sanitizer.bypassSecurityTrustResourceUrl( image && image.dataUrl );
        this.lastLocal.foto3 = image.dataUrl;
        this.apiService.updateStorageMant(this.lastLocal);
        break;
      case 4:
        this.photo4 = this.sanitizer.bypassSecurityTrustResourceUrl( image && image.dataUrl );
        this.lastLocal.foto4 = image.dataUrl;
        this.apiService.updateStorageMant(this.lastLocal);
        break;

    }


    // console.log(image.dataUrl)
  }


  retroceder(){
    if (this.pagina == 0) {
      // console.log("volver");
      this.closeModal();
    }else{
      this.titulo = "Adjuntar Evidencia";
      this.pagina = 0;
    }
  }
  async avanzar(){
    if (this.pagina == 1) {
      // console.log("end");


      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Enviar Ficha',
        message: '<strong>¿Esta seguro que desea enviar esta ficha?</strong>',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              // console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Si',
            handler: () => {
              this.lastLocal.estado = 1;
              this.apiService.updateStorageMant(this.lastLocal);
              this.closeModal();
            }
          }
        ]
      });

      await alert.present();



    }else{
      this.titulo = "Recibí Conforme";
      this.pagina = 1;
    }
  }

  async closeModal() {
    const onClosedData: any = 'ok';
    await this.modalController.dismiss(onClosedData);
  }

}

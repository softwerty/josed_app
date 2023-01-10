import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-modalqr',
  templateUrl: './modalqr.page.html',
  styleUrls: ['./modalqr.page.scss'],
})
export class ModalqrPage implements OnInit {

  isInput: any;

  idEquipo: any;
  idTipoEquipo: any;
  nombreTipoEquipo: any;
  data: any;
  alerta:any;

  nSerie: any;
  tokenJwt:any;

  constructor(
    private modalController: ModalController,
    private barcodeScanner: BarcodeScanner,
    private navParams: NavParams,
    private apiService: ApiService,
    private toastController: ToastController
    ) { }
  @ViewChild('inputId', {static: false}) ionInput: { setFocus: () => void; };
  setFocusOnInput() {
    this.ionInput.setFocus();
 }
  ngOnInit() {

    this.isInput = this.navParams.data.isInput;
    this.tokenJwt = this.navParams.data.tokenJwt;

    if(!this.isInput){
        this.scan();
    }
    // this.setFocusOnInput();
    // this.idEquipo = 228;
  }

  async closeModal() {
    const onClosedData: any = this.idEquipo;
    await this.modalController.dismiss(onClosedData);
  }

  crearFicha(){
    if (!this.nSerie){
      this.alerta = "Ingrese un código válido";
      return;
    }


    this.apiService.getDetalleEquipo(this.nSerie,this.tokenJwt).subscribe(
      data => {

        // console.log("mantenciones para",data);
        if(data == null){
          this.alerta = "No fue posible conectar con el N° de Serie";
          return;
        }else{

          //  console.log("resultado",data['idEquipo']);
          this.idEquipo = data['idEquipo'];
          this.idTipoEquipo = data['idTipoEquipo'];
          this.nombreTipoEquipo = data['nombreTipoEquipo'];

          this.closeModal()

        }


    }
);




  }

  back(){
    this.idEquipo = 0;
    this.closeModal();
  }

  scan() {
    this.data = null;
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.data = barcodeData.text;

      if (this.data.includes("/alarma/")) {
        var res = this.data.replace(environment.URL_TEMPLATE+"/alarma/", "").replace("/alarma/", "");
        // res = this.data.replace("/alarma/", "");
        this.idEquipo = res;
        this.closeModal();
      }else{




        let toast = this.toastController.create({
          message: `QR no valido!`,
          duration: 3000,
          position: 'bottom'
        });
        toast.then(toast => toast.present());
        this.back();
      }



    }).catch(err => {
      console.log('Error', err);
      let toast = this.toastController.create({
        message: `Error al leer el QR! `+err,
        duration: 3000,
        position: 'bottom'
      });
      toast.then(toast => toast.present());
    });
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';

@Component({
  selector: 'app-modalcliente',
  templateUrl: './modalcliente.page.html',
  styleUrls: ['./modalcliente.page.scss'],
})
export class ModalclientePage implements OnInit {

  dataTop: any;

  idEquipo: any;
  codigo: any;

  idTipoEquipo: any;
  nombreTipoEquipo: any;



  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private platform: Platform
    ) {
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.back();
      });
    }

  ngOnInit() {
   console.table( this.navParams.data.dataTop);
   this.codigo = this.navParams.data.dataTop.codigo;
    this.dataTop = this.navParams.data.dataTop;

   this.idTipoEquipo = this.navParams.data.dataTop.idTipoEquipo;
   this.nombreTipoEquipo = this.navParams.data.dataTop.nombreTipoEquipo;
  console.log(this.nombreTipoEquipo);


  }

  async continuar(){
    const onClosedData: any = this.dataTop;
    await this.modalController.dismiss(onClosedData);
  }

  back(){
    this.dataTop = 0;
    this.continuar();
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams,Platform  } from '@ionic/angular';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  @Input() firstName: string;
  @Input() lastName: string;
  @Input() middleInitial: string;

  lastLocal: any;
  dataTemplate: any;
  time: string;
  id: string;
  id_equipo: string;

  indexForm: number;
  indexHeadForm: number;

  cuenta: number;

  textoBoton: string;

  tituloModal: string;

  constructor(
    private apiService: ApiService,
    private modalController: ModalController,
    private navParams: NavParams,
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log("back modaljs");

      this.retroceder();
    });
  }

  ngOnInit() {
    // console.table(this.navParams);
    this.lastLocal = this.navParams.data.lastLocal;
    this.dataTemplate = JSON.parse(this.navParams.data.lastLocal['data'])['bloques'];
    this.time = this.navParams.data.lastLocal['time'];
    this.id = this.navParams.data.lastLocal['id'];
    this.id_equipo = this.navParams.data.lastLocal['id_equipo'];

    this.indexHeadForm = 0;
    this.indexForm = 0;

    this.textoBoton = "Continuar";

    this.cuenta = 1;

    this.setTitulo();

// console.log(this.time);
    // console.table(this.dataTemplate);

  }

  async closeModal() {
    console.log("close modal");
    const onClosedData: any = this.lastLocal;
    // console.table(onClosedData);
    await this.modalController.dismiss(onClosedData);
  }
  segmentChanged(that){
    // console.table(this.dataTemplate);

//
    this.lastLocal['data'] = JSON.stringify({'bloques':this.dataTemplate});
    // console.table(this.lastLocal);

     console.log('edito')
    console.table(this.lastLocal);
    this.apiService.updateStorageMant(this.lastLocal);


  }
//   continuar(){


// // this.indexHeadForm = 0; //bloque
// // this.indexForm = 0; //subBloque
//     this.avanzar();

//   }

  avanzar(){


    let siCuenta = true;
    let maxBloques = this.dataTemplate.length;
    let maxSubBloques = this.dataTemplate[this.indexHeadForm]['sub_bloques'].length;

    this.textoBoton = "Continuar";

    if (this.indexForm + 1 < maxSubBloques) {//aun quedan subBloques, solo aumentar sub
      this.indexForm++;
    }else{// si no quedan subbloques, aumentar bloque
      if (this.indexHeadForm + 1 < maxBloques) {//aun quedan bloques
        this.indexHeadForm++;
        this.indexForm = 0;
      }else{
        this.textoBoton = "Finalizar";
        siCuenta = false;
        this.closeModal()
        //ACÁ IRIA EL FLUJO DE FINALIZACION
      }

    }
    if (siCuenta)
      this.cuenta++;
    this.setTitulo()
  }

  retroceder(){

    this.textoBoton = "Continuar";
    let siCuenta = true;
    let maxBloques = this.dataTemplate.length;
    let maxSubBloques = this.dataTemplate[this.indexHeadForm]['sub_bloques'].length;



    if (this.indexForm >= 1) {//aun quedan subBloques, solo aumentar sub
      this.indexForm--;
    }else{// si no quedan subbloques, aumentar bloque
      if (this.indexHeadForm >= 1) {//aun quedan bloques
        this.indexHeadForm--;
        maxSubBloques = this.dataTemplate[this.indexHeadForm]['sub_bloques'].length;
        this.indexForm = maxSubBloques-1;
      }else{
        this.lastLocal = 0;
        this.closeModal();
        siCuenta = false;

        //ACÁ IRIA EL FLUJO DE FINALIZACION
      }

    }
    if (siCuenta)
      this.cuenta--;
    this.setTitulo()
  }

  setTitulo(){
    if (this.dataTemplate[this.indexHeadForm]['sub_bloques'][this.indexForm].titulo == "") {
      this.tituloModal =  this.cuenta + ". " +this.dataTemplate[this.indexHeadForm].titulo;
    }else{
      this.tituloModal =  this.cuenta + ". " +this.dataTemplate[this.indexHeadForm]['sub_bloques'][this.indexForm].titulo;
    }


  }


}

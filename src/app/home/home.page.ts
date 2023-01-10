import { Platform, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject,Observable, from, of, forkJoin } from 'rxjs';

import { Network } from '@ionic-native/network/ngx';
import { NetworkService, ConnectionStatus } from '../services/network.service';
import { ToastController } from '@ionic/angular';
import { switchMap, finalize } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Storage } from '@ionic/storage';

import { ModalController } from '@ionic/angular';

import { ModalPage } from '../modal/modal.page';
import { ModalqrPage } from '../modalqr/modalqr.page';
import { ModalclientePage } from '../modalcliente/modalcliente.page';
import { ModaltecnicoComponent } from '../modaltecnico/modaltecnico.component';

import { FinfichaPage } from '../finficha/finficha.page';

import { environment } from '../../environments/environment';
//enviroment environment
const TOKEN_KEY =  environment.TOKEN_KEY;
const VERSION_APP = environment.VERSION_APP;
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


// export enum ConnectionStatus {
//   Online,
//   Offline
// }

const STORAGE_MANT_KEY = environment.STORAGE_MANT_KEY;
const API_URL_TEMPLATE = environment.API_URL_TEMPLATE;
//  const API_URL_TEMPLATE = 'http://appmantweb.test/api';
interface StoredMantencion {
  data: any,
  time: number,
  id: string,
  id_equipo: string,
  codigo: string,
  beneficiario: string,
  fono_bene: string,
  direccion_bene: string,
  foto1: string,
  foto2: string,
  foto3: string,
  foto4: string,
  estado: number,
  send: number,
}




// const headers = new HttpHeaders({
//   //  'Authorization': "Bearer jhjhijgklgkjggj",
//   'Content-Type': 'application/json',
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': '*',
//   'Accept': 'application/json, text/plain'
// });

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  VERSION_APP = VERSION_APP;
  users = [];
  tecnico = [];
  user = null;

  repoTemplate = null;
  repoTemplateFull = null;

  postPendientes = null;
  mantencionesPendientes = null;

  dataReturned: any;

  tokenJwt = null;

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

  constructor(
    public modalController: ModalController,
    private network: Network,
    private auth: AuthService,
    private apiService: ApiService,
    private plt: Platform,
    private networkService: NetworkService,
    private toastController: ToastController,
    private storage: Storage,
    private http: HttpClient,
    private platform: Platform,
    public alertController: AlertController,
    ) {
    this.initializeNetworkEvents();
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
    });
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  public initializeNetworkEvents() {

    this.network.onDisconnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Online) {
        console.log('WE ARE OFFLINE 2');
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });

    this.network.onConnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Offline) {
        console.log('WE ARE ONLINE 2');
        this.updateNetworkStatus(ConnectionStatus.Online);

      }
    });
  }
  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);

    let connection = status == ConnectionStatus.Offline ? 'Offline' : 'Online';
    // if (!ConnectionStatus.Offline) {
      this.enviarMantencionesHome().subscribe();
    // }
  }

  ionViewWillEnter() {
    this.user = this.auth.getUser();
  }

  logout() {
    this.auth.logout();
    this.loadAllSinsend();

  }

  ngOnInit() {
    this.plt.ready().then(() => {
      this.loadAll();
      // this.loadData(true);
      // this.loadDataTemplate(true);
    });
  }

  loadData(refresh = false, refresher?) {

        // this.apiService.getUsers(refresh).subscribe(res => {
          // this.users = res;
        //   if (refresher) {
        //     refresher.target.complete();
        //   }
        // });

    this.storage.get(TOKEN_KEY).then(token => {
        this.apiService.getTecnico(token).subscribe(res => {
          this.tecnico = res;
          this.tokenJwt=token;
          console.log("tecnico home",this.tecnico)
          if (refresher) {
            refresher.target.complete();
          }
        });
        // return token;

      });

  }

  loadPost() {
    // this.apiService.getStoragePost().then(data =>this.postPendientes = data);
    // console.log("post:",this.postPendientes);
  }

  loadMantenciones() {
    this.apiService.getStorageMantenciones().then(data =>this.mantencionesPendientes = data);
    console.log("mantenciones:",this.mantencionesPendientes);
  }

  loadDataTemplate(refresh = false, refresher?) {
    this.apiService.getTemplate(refresh).subscribe(res => {
      this.repoTemplate = res;
        console.log("template cargado");
      if (refresher) {
        refresher.target.complete();
      }
    });

    this.apiService.getTemplateFull(refresh).subscribe(res => {
      this.repoTemplateFull = res;
        console.log("templateFull cargado");
      if (refresher) {
        refresher.target.complete();
      }
    });
  }

  loadAll(refresh = false, refresher?){
    this.loadData(refresh, refresher);
      this.loadDataTemplate(refresh, refresher);
      // this.loadPost();
      this.loadMantenciones();
     this.enviarMantenciones()
      // refresher.target.complete();

  }
  loadAllSinsend(refresh = false, refresher?){
    this.loadData(refresh, refresher);
      this.loadDataTemplate(refresh, refresher);
      // this.loadPost();
      this.loadMantenciones();
    //  this.enviarMantenciones()
      // refresher.target.complete();

  }

  updateUser(id) {
    this.apiService.updateUser(id, {name: 'Simon', job: 'CEO'}).subscribe();
  }

  sendMantencion(data_registro) {
    this.apiService.sendMantencion({token: 'xx', datos: JSON.stringify(data_registro)}).subscribe();

  }

  createMantencion(data) {
// console.log("captura",data.idEquipo);

    // si existe el index data.idTipoEquipo dentro de repoTemplateFull entonces tomamos ese template, sino tomamos el template por defecto repoTemplate

    let repoParaEnviar = this.repoTemplate;

    if (this.repoTemplateFull[data.idTipoEquipo] != undefined) {
      repoParaEnviar = this.repoTemplateFull[data.idTipoEquipo];
    }

    this.apiService.createMantencion(data,JSON.stringify(repoParaEnviar)).then(dataResp => {this.completecreate(dataResp)} );


    // this.apiService.createMantencion(data,JSON.stringify(this.repoTemplate)).then(dataResp => {this.completecreate(dataResp)} );




    // let respuesta = from(this.apiService.createMantencion(id_equipo,JSON.stringify(this.repoTemplate)));
    // this.loadAll();
    // return respuesta;
  }

  completecreate(dataResp){
    let arrMantLocal =  JSON.parse(dataResp);
    let lastLocal = arrMantLocal[arrMantLocal.length - 1];
    // console.log("resp: ",lastLocal);
    console.table(lastLocal);
    this.openModal(lastLocal);
    this.loadAll();

  }

  cerarMantencion() {
     this.apiService.cerarMantencion();
     this.loadAll();
  }

  enviarMantenciones(){
    // this.apiService.enviarMantenciones().subscribe(() => this.loadAll() );
    this.enviarMantencionesHome().subscribe();
    // const result = await this.apiService.enviarMantenciones();

    // this.apiService.enviarMantenciones().pipe(
    //   finalize(() => {
    //     this.loadAll();
    //   })

    // );

    // from(this.storage.get(STORAGE_MANT_KEY)).pipe(

  }


  enviarMantencionesHome(): Observable<any> {
// return;
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      // Return the cached data from Storage
      let toast = this.toastController.create({
        message: `Data no sincronizada no hay conexion a internet!`,
        duration: 3000,
        position: 'bottom'
      });
      toast.then(toast => toast.present());
      return null;
    } else {
       return from(this.storage.get(STORAGE_MANT_KEY)).pipe(
        switchMap(storedOperations => {
          let storedObj = JSON.parse(storedOperations);
          if (storedObj && storedObj.length > 0) {
            console.log("SINCORNIZANDO:")
            console.table(storedObj);
            return this.sendRequests(storedObj).then(
              finalize(() => {

                let toast = this.toastController.create({
                  message: `Sincronizando datos...`,
                  duration: 3000,
                  position: 'bottom'
                });
                toast.then(toast => toast.present());
                // this.loadAll();
                // this.storage.remove(STORAGE_MANT_KEY).then(() => this.loadAll());

              })
            );
          } else {
            console.log('no local events to sync');
            // this.loadAll();
            return of(false);
          }
        })
      )
    }



  }
  async sendRequests(operations: StoredMantencion[]) {

// return;
    let obs = [];


    for (let op of operations) {
      // console.log('Make one request: ', op.data );
      console.log("enviando")
      console.table(op)
      // let oneObs = this.http.request('POST', `${API_URL_TEMPLATE}/sendrevision/`, op.data );
      // let oneObs = this.http.request('POST', `${API_URL_TEMPLATE}/sendrevision/`, {idx: op.id_equipo, data: op.data} );
      // console.table(op.data);
      if (op.estado == 1 && op.send == 0) {
        //  let oneObs = this.http.post(`${API_URL_TEMPLATE}/sendrevision/`, {uid:op.id+op.time ,id: op.id_equipo, data: op.data});
        op.send = 1;
        await this.apiService.updateStorageMant(op);
        this.loadMantenciones()

        const headers = { 'Authorization': 'Bearer ' + this.tokenJwt   };

        //await this.http.post(`${API_URL_TEMPLATE}/sendrevision/`, op,{headers}).subscribe(response => {
        await this.http.post(`${API_URL_TEMPLATE}/sendrevision/`, op,{headers}).subscribe(response => {
            this.deleteStorageByTime(op.time);
               this.loadAllSinsend();
              return console.log(response);
          }, async error => {
            op.send = 0;
            await this.apiService.updateStorageMant(op);
            this.loadMantenciones()
            // console.log("OCURRIO UN ERROR");
            // this.deleteStorageByTime(op.time);
            let toast = this.toastController.create({
              message: `ha ocurrido un error al intentar sincronizar la información, intente mas tarde.`,
              duration: 5000,
              position: 'bottom'
            });
            toast.then(toast => toast.present());
             this.loadAllSinsend();
          });

        //  obs.push(oneObs);
      }


    }

    // Send out all local events and return once they are finished
    return forkJoin(obs);
  }


  async deleteStorageByTime(time){

    return this.storage.get(STORAGE_MANT_KEY).then(async storedOperations => {
      let storedObj = JSON.parse(storedOperations);

      console.table(storedObj);
      let index = 0;
      storedObj.forEach(element => {
        if (element.time == time) {
          storedObj.splice(index,1);
        }
        index++;
      });
        await this.storage.set(STORAGE_MANT_KEY, JSON.stringify(storedObj));
        this.loadAll();
        return;
    });

  }

  async borrarMantencionBtn(time){

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Enviar Ficha',
      message: '<strong>¿Esta seguro que desea eliminar esta ficha?</strong>',
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
            this.deleteStorageByTime(time);
          }
        }
      ]
    });

    await alert.present();


  }



  async openModal(lastLocal) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        "lastLocal": lastLocal
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log("retorno x",dataReturned.data)
        //EN ESTE PUNTO TERMINÓ LA FICHA
        if (dataReturned.data == 0 || dataReturned.data === undefined) { //cerró con volver
          return;
        }
          console.table(dataReturned.data)
          this.endFicha(dataReturned.data);


        // this.dataReturned = dataReturned.data;


        //alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();
  }




  editMantModal(time,send = 0) {

    if (send) {
      return;
    }
    return this.storage.get(STORAGE_MANT_KEY).then(storedOperations => {
      let storedObj = JSON.parse(storedOperations);

      console.table(storedObj);
      let index = 0;
      storedObj.forEach(element => {
        if (element.time == time) {
          console.log("ELEMENTO");
          console.table(element);
          this.openModal(element);
          return element;
        }
        index++;
      });


    });
    // let arrMantLocal =  dataResp;
    // let lastLocal = arrMantLocal[arrMantLocal.length - 1];
    // console.log("resp: ",dataResp);
    // this.openModal(dataResp);
    // this.loadAll();
  }


  async nuevaFicha(){
    //llama a modal LECTOR QR
    const modal = await this.modalController.create({
      component: ModalqrPage,
      componentProps: {
        "isInput": false,
        "tokenJwt":this.tokenJwt
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        if (dataReturned.data == 0 || dataReturned.data === undefined) {
          return;
        }
        this.dataReturned = dataReturned.data;
        this.detalleCliente(this.dataReturned);
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();

  }


  async nuevaFichaInput(){
    //llama a modal LECTOR QR
    const modal = await this.modalController.create({
      component: ModalqrPage,
      componentProps: {
        "isInput": true,
        "tokenJwt":this.tokenJwt
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        if (dataReturned.data == 0 || dataReturned.data === undefined) {
          return;
        }
        this.dataReturned = dataReturned.data;
        this.detalleCliente(this.dataReturned);
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();

  }



  detalleCliente(idEquipo){
    // console.log("aca",idEquipo);
    this.apiService.getDetallecliente(idEquipo,this.tokenJwt).subscribe(
              data => {

                // console.log("mantenciones para",data);
                if(data == false){
                  let stringDefault = '{"titulo":"No internet", "codigo":"No internet", "idEquipo":"No internet", "nombre_bene":"No internet", "rut_bene":"No internet", "fono_bene":"No internet", "direccion_bene":"No internet", "tipo_de_csti":null, "marca":null, "modelo":null, "numero de serie":null, "ano_instalacion":null, "nombre_tecnico":"test", "rut_tecnico":"test","email_tecnico":"test", "fecha_tecnico":"test","nvisita":"test"}';
                  // console.log("mantenciones def",JSON.parse(stringDefault));

                  this.iniDetalleCliente( JSON.parse(stringDefault));
                }else{
                  // console.log("mantenciones def",data);
                  this.iniDetalleCliente(data);

                }


            }
    );

  }

  async iniDetalleCliente(data){

       //DEBEMOS PASARLE LOS DATOS DEL CLIENTE
    const modal = await this.modalController.create({
      component: ModalclientePage,
      componentProps: {
        "dataTop": data
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        // console.log(dataReturned,"asdf");
        if (dataReturned.data == 0 || dataReturned.data === undefined) {
          return;
        }else{

        this.dataReturned = dataReturned.data;
        this.createMantencion(this.dataReturned);
        }

        //alert('Modal Sent Data :'+ dataReturned);

      }
    });

    return await modal.present();

  }

  async endFicha(ficha){
       //DEBEMOS PASARLE LOS DATOS DEL CLIENTE
       const modal = await this.modalController.create({
        component: FinfichaPage,
        componentProps: {
          "ficha": ficha
        }
      });

      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null) {
          this.dataReturned = dataReturned.data;
          this.loadAll();
          // this.createMantencion(this.dataReturned);
          //alert('Modal Sent Data :'+ dataReturned);

        }
      });

      return await modal.present();
  }

  addPhotoToGallery() {

  // const options: CameraOptions = {
  //   quality: 100,
  //   destinationType: this.camera.DestinationType.FILE_URI,
  //   encodingType: this.camera.EncodingType.JPEG,
  //   mediaType: this.camera.MediaType.PICTURE
  // }
  //   //this.photoService.addNewToGallery();
  //   this.camera.getPicture(options).then((imageData) => {
  //     // imageData is either a base64 encoded string or a file URI
  //     // If it's base64 (DATA_URL):
  //     let base64Image = 'data:image/jpeg;base64,' + imageData;
  //    }, (err) => {
  //     // Handle error
  //    });

  }





// iniciarModal(){
//   const { data } = await modal.onWillDismiss();
// console.log(data);
// }




}

import { OfflineManagerService } from './offline-manager.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage } from '@ionic/storage';
import { Observable, from, of, forkJoin } from 'rxjs';
import { tap, map, catchError } from "rxjs/operators";
import { switchMap, finalize } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { environment } from '../../environments/environment';



const API_STORAGE_KEY = 'specialkey';
// const API_STORAGE_KEY_TEMPLATE = 'specialkeyTemplate';
const API_URL = 'https://reqres.in/api';
const API_URL_TEMPLATE = environment.API_URL_TEMPLATE;
//  const API_URL_TEMPLATE = 'http://appmantweb.test/api';

const STORAGE_REQ_KEY = 'storedreq';
const STORAGE_MANT_KEY = 'storedreqpost';

const headers = new HttpHeaders({
  //  'Authorization': "Bearer jhjhijgklgkjggj",
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Accept': 'application/json, text/plain'
});

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  })
};

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




@Injectable({
  providedIn: 'root'
})
export class ApiService {



  constructor(private http: HttpClient, private networkService: NetworkService, private storage: Storage, private offlineManager: OfflineManagerService, private toastController: ToastController) {

   }





  getUsers(forceRefresh: boolean = false): Observable<any[]> {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline || !forceRefresh) {
      // Return the cached data from Storage
      return from(this.getLocalData('users'));
    } else {
      // Just to get some "random" data
      let page = Math.floor(Math.random() * Math.floor(6));

      // Return real API data and store it locally
      return this.http.get(`${API_URL}/users?per_page=2&page=${page}`).pipe(
        map(res => res['data']),
        tap(res => {
          this.setLocalData('users', res);
        })
      )
    }
  }

  getTecnico(token): Observable<any[]> {
    console.log("token desde funct",token)
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      // Return the cached data from Storage
      return from(this.getLocalData('tecnico'));
    } else {
      const headers = { 'Authorization': 'Bearer '+token};
      return this.http.get<any>(`${API_URL_TEMPLATE}/user`,{headers}).pipe(
        map(res => res['user']),
        tap(res => {
          // console.log('tecnicoc', res)
          this.setLocalData('tecnico', res);
        })
      )
    }
  }



  getTemplate(forceRefresh: boolean = false): Observable<any[]> {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      // Return the cached data from Storage
      return from(this.getLocalData('template'));
    } else {
      // Just to get some "random" data
      // let page = Math.floor(Math.random() * Math.floor(6));

      // Return real API data and store it locally
      return this.http.get(`${API_URL_TEMPLATE}/getformatorepo`).pipe(
        map(res => res['mid']),
        tap(res => {
          this.setLocalData('template', res);
        })
      )
    }
  }

  updateUser(user, data): Observable<any> {
    let url = `${API_URL}/users/${user}`;
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.offlineManager.storeRequest(url, 'PUT', data));
    } else {
      return this.http.put(url, data).pipe(
        catchError(err => {
          this.offlineManager.storeRequest(url, 'PUT', data);
          throw new Error(err);
        })
      );
    }
  }


  sendMantencion(data): Observable<any> {
    let YourHeaders = {'Content-Type':'text/html; charset=UTF-8'};

    let url = `${API_URL_TEMPLATE}/sendrevision/`;
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      // console.log("asdas");
      return from(this.offlineManager.storeRequest(url, 'POST', data));
    } else {
      // return this.http.post(url, {name: 'Simon', job: 'CEO'},{headers: YourHeaders}).pipe(
      return this.http.post(url, data).pipe(
        catchError(err => {
          this.offlineManager.storeRequest(url, 'POST', data);
          throw new Error(err);
        })
      );
    }
  }


  setLocalRegistro(){

  }

  // Save result of API requests
  private setLocalData(key, data) {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }
  // Get cached API result
  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }


  getStoragePost() {
      // Return the cached data from Storage
      // return from(this.storage.get(STORAGE_REQ_KEY));


      return this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
        let storedObj = JSON.parse(storedOperations);
  // return storedOperations;
  return storedObj;
      });


  }

  getStorageMantenciones() {
    return this.storage.get(STORAGE_MANT_KEY).then(storedOperations => {
      let storedObj = JSON.parse(storedOperations);
    // return storedOperations;
    return storedObj;
    });


}

  createMantencion(data,template): Promise<any> {

     let action: StoredMantencion = {
        data: template,
        time: new Date().getTime(),
        id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
        id_equipo: data.idEquipo,
        codigo: data.codigo,
        beneficiario:data.nombre_bene,
        fono_bene: data.fono_bene,
        direccion_bene: data.direccion_bene,
        foto1: "",
        foto2: "",
        foto3: "",
        foto4: "",
        estado: 0,
        send: 0,

      };

    //SI TIENE INTERNET TRATARÁ DE OBTENER EL CODIGO DEL EQUIPO Y NOMBRE BENEFICIARIO
    // let url = `${API_URL}/datauser/${data.idEquipo}`;
    // if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {

         return this.storage.get(STORAGE_MANT_KEY).then(storedOperations => {
          let storedObj = JSON.parse(storedOperations);

          if (storedObj) {
            storedObj.push(action);
          } else {
            storedObj = [action];
          }
          // console.log(storedObj);
          // Save old & new local transactions back to Storage
          return this.storage.set(STORAGE_MANT_KEY, JSON.stringify(storedObj));
        });

    // } else { //POR AHORA HAREMOS LO MISMO TENGA O NO INTERNET

    //   return this.storage.get(STORAGE_MANT_KEY).then(storedOperations => {
    //     let storedObj = JSON.parse(storedOperations);

    //     if (storedObj) {
    //       storedObj.push(action);
    //     } else {
    //       storedObj = [action];
    //     }
    //     console.log(storedObj);
    //     // Save old & new local transactions back to Storage
    //     return this.storage.set(STORAGE_MANT_KEY, JSON.stringify(storedObj));
    //   });
    // }
    //SI NO TIENE PONDRA DATOS POR DEFECTO


    //CREARÁ UN OBJETO DE LA MANTENCION Y LO GUARDAÁ EN STORAGE

  }



  cerarMantencion(){
    return this.storage.remove(STORAGE_MANT_KEY);
  }

  // enviarMantenciones(){

  // }

  enviarMantenciones(): Observable<any> {

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
            return this.sendRequests(storedObj).pipe(
              finalize(() => {
                let toast = this.toastController.create({
                  message: `Data sincronizada con el API!`,
                  duration: 3000,
                  position: 'bottom'
                });
                toast.then(toast => toast.present());

                this.storage.remove(STORAGE_MANT_KEY);
              })
            );
          } else {
            console.log('no local events to sync');
            return of(false);
          }
        })
      )
    }



  }

  sendRequests(operations: StoredMantencion[]) {
    let obs = [];

    for (let op of operations) {
      console.log('Make one request: ', op.data );
      // let oneObs = this.http.request('POST', `${API_URL_TEMPLATE}/sendrevision/`, op.data );
      // let oneObs = this.http.request('POST', `${API_URL_TEMPLATE}/sendrevision/`, {idx: op.id_equipo, data: op.data} );
      let oneObs = this.http.post(`${API_URL_TEMPLATE}/sendrevision/`, {uid:op.id+op.time ,id: op.id_equipo, data: op.data});
      obs.push(oneObs);
    }

    // Send out all local events and return once they are finished
    return forkJoin(obs);
  }


  updateStorageMant(action){
    // let action: StoredMantencion = {
    //   data: data,
    //   time: time,
    //   id: id,
    //   id_equipo: id_equipo,
    //   codigo: "No Internet: id "+id_equipo,
    //   beneficiario:"No Internet para nombre: id "+id_equipo
    // };

    // console.table(data);

       return this.storage.get(STORAGE_MANT_KEY).then(storedOperations => {
        let storedObj = JSON.parse(storedOperations);

        console.table(storedObj);
        let index = 0;
        storedObj.forEach(element => {
          if (element.time == action.time) {
            storedObj.splice(index,1);
          }
          index++;
        });

        // if (storedObj) {
          storedObj.push(action);
        // } else {
        //   storedObj = [action];
        // }
        // console.log(storedObj);
        // Save old & new local transactions back to Storage
        // console.table(storedObj);
        // return this.storage.remove(STORAGE_MANT_KEY).then(() => {
          return this.storage.set(STORAGE_MANT_KEY, JSON.stringify(storedObj));
        // });






        // if (storedObj) {
        //   storedObj.push(action);
        // } else {
        //   storedObj = [action];
        // }
        // // console.log(storedObj);
        // // Save old & new local transactions back to Storage
        // return this.storage.set(STORAGE_MANT_KEY, JSON.stringify(storedObj));
      });

  }

  getStorageByTime(time){
    return this.storage.get(STORAGE_MANT_KEY).then(storedOperations => {
      let storedObj = JSON.parse(storedOperations);

      console.table(storedObj);
      let index = 0;
      storedObj.forEach(element => {
        if (element.time == time) {
          console.log(element);
          return element;
        }
        index++;
      });


    });

  }

  // deleteStorageByTime(time){

  //   return this.storage.get(STORAGE_MANT_KEY).then(storedOperations => {
  //     let storedObj = JSON.parse(storedOperations);

  //     console.table(storedObj);
  //     let index = 0;
  //     storedObj.forEach(element => {
  //       if (element.time == time) {
  //         storedObj.splice(index,1);
  //       }
  //       index++;
  //     });
  //       return this.storage.set(STORAGE_MANT_KEY, JSON.stringify(storedObj));

  //   });

  // }

  getDetallecliente(idCLietne,token): Observable<any> {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline ) {
      // if (true ) {
      // Return the cached data from Storage
// console.log("retorno null");
      return of(false);
    } else {
      // Just to get some "random" data
      // let page = Math.floor(Math.random() * Math.floor(6));

      // Return real API data and store it locally
      const headers = { 'Authorization': 'Bearer '+token};
      return this.http.get(`${API_URL_TEMPLATE}/getDetalleCliente/${idCLietne}`,{headers}).pipe(
        map(res => res['top']),
        tap(res => {
          // this.setLocalData('template', res);
        })
      )
    }
  }

  getDetalleEquipo(nSerie,token): Observable<any> {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline ) {
      // if (true ) {
      // Return the cached data from Storage
// console.log("retorno null");
      return of(false);
    } else {
      // Just to get some "random" data
      // let page = Math.floor(Math.random() * Math.floor(6));

      // Return real API data and store it locally
      // const headers = { 'Authorization': 'Bearer '+token};
      return this.http.get(`${API_URL_TEMPLATE}/getDetalleEquipo/${nSerie}`).pipe(
        // return this.http.get(`${API_URL_TEMPLATE}/getDetalleEquipo/${nSerie}`,{headers}).pipe(
        map(res => res['data']),
        tap(res => {
          // this.setLocalData('template', res);
        })
      )
    }
  }


  // private setLocalDataTemplate(key, data) {
  //   this.storage.set(`${API_STORAGE_KEY_TEMPLATE}-${key}`, data);
  // }
  // private getLocalDataTemplate(key) {
  //   return this.storage.get(`${API_URL_TEMPLATE}-${key}`);
  // }
}

import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const helper = new JwtHelperService();
const TOKEN_KEY = environment.TOKEN_KEY;
 const API_URL_TEMPLATE = environment.API_URL_TEMPLATE;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);

  constructor(private storage: Storage, private http: HttpClient, private plt: Platform, private router: Router) {
    this.loadStoredToken();
  }

  loadStoredToken() {
    let platformObs = from(this.plt.ready());

    this.user = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get(TOKEN_KEY));
      }),
      map(token => {
        if (token) {
          let decoded = helper.decodeToken(token);
          this.userData.next(decoded);
          return true;
        } else {
          return null;
        }
      })
    );
  }

  // sessionToken() {

  //   // return from(this.storage.get(TOKEN_KEY));
  //   return this.storage.get(TOKEN_KEY).then(token => {

  //     return token;
  //   });
  // }

  login(credentials: {email: string, password: string }) {
    // Normally make a POST request to your APi with your login credentials
    // if (credentials.email != 'nicolas@saymu.cl' || credentials.password != '123') {
    //   return of(null);
    // }

    return this.http.post(API_URL_TEMPLATE+'/login',credentials).pipe(
      map(res => {
        console.log("resultado",res)
        if (!res['token']) {
          // console.log("notekn")
          return null;
        }
        // Extract the JWT, here we just fake it
        // return `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1Njc2NjU3MDYsImV4cCI6MTU5OTIwMTcwNiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoiMTIzNDUiLCJmaXJzdF9uYW1lIjoiU2ltb24iLCJsYXN0X25hbWUiOiJHcmltbSIsImVtYWlsIjoic2FpbW9uQGRldmRhY3RpYy5jb20ifQ.4LZTaUxsX2oXpWN6nrSScFXeBNZVEyuPxcOkbbDVZ5U`;
        // return `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1Njc2NjU3MDYsImV4cCI6MTYyMjgzMTg1MCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoiMTIzNDUiLCJmaXJzdF9uYW1lIjoiTmljb2xhcyIsImxhc3RfbmFtZSI6IlNhZXoiLCJlbWFpbCI6Im5pY29sYXNAc2F5bXUuY2wiLCJqdGkiOiIzNTYzZGU3Mi01YzY4LTQ3NDctYTUxZi0zYzIyNzQ2MGU4ZGUifQ.xreREt9BOKJWlaNh5JVwDUTSIJnKMFObjivrNeVcmw4`;
        return res['token'];
      }),
      switchMap(token => {
        // console.log("noteknswitch",token)
        if (token == null) {
          return of(null);
        }
        let decoded = helper.decodeToken(token);
        this.userData.next(decoded);

        let storageObs = from(this.storage.set(TOKEN_KEY, token));
        return storageObs;
      })
    );

        //   deposit(account, amount){
        //     return this.http.get('url')
        //     .pipe(
        //         map(res => {
        //             return res;
        //         });
        //     );
        // }

  }

  getUser() {
    return this.userData.getValue();
  }

  logout() {

    this.storage.clear().then(() => {
      this.router.navigateByUrl('/').then(() => {
        location.reload();
      });
      this.userData.next(null);
      // location.reload();
    });

    // this.storage.remove(TOKEN_KEY).then(() => {
    //   this.storage.clear();
    //   this.router.navigateByUrl('/');
    //   this.userData.next(null);
    // });
  }



}

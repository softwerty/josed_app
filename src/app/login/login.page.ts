import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  credentials = {
    email: '',
    password: '',
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  login() {
    this.auth.login(this.credentials).subscribe(async res => {
      if (res) {
        this.router.navigateByUrl('/home');
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Login Failed',
          message: 'Credenciales Incorrectas.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  forgotpassword() {
    //navigate en new url URL_TEMPLATE
    window.open(environment.URL_TEMPLATE + '/forgot-password', '_blank');
  }

}

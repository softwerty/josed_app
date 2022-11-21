import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-modaltecnico',
  templateUrl: './modaltecnico.component.html',
  styleUrls: ['./modaltecnico.component.scss'],
})

export class ModaltecnicoComponent implements OnInit {

  constructor(public modalController: ModalController) { }

  @Input() firstName: string;
  @Input() lastName: string;
  @Input() middleInitial: string;

  ngOnInit() {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'firstName': 'Douglas',
        'lastName': 'Adams',
        'middleInitial': 'N'
      }
    });
    return await modal.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}

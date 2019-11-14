import { Component } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  currentLocationDetails: any = null;
  loadingCheckIn: boolean = false;

  constructor(
    private platform: Platform,
    public loadingCtrl: LoadingController
  ) {}

  async checkIn(){
    try {
      this.platform.ready().then(async ()=>{
        this.loadingCheckIn = true;
        this.currentLocationDetails = await Geolocation.getCurrentPosition();
        // this.currentLocationDetails = await this.geolocation.getCurrentPosition();
        console.log(this.currentLocationDetails);
        this.loadingCheckIn = false;
      });
    } catch (error) {
      console.error(error);
    }   
  }


}

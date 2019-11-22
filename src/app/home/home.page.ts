import { Component } from '@angular/core';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
//CAPACITOR
// import { Plugins } from '@capacitor/core';
// const { Geolocation } = Plugins;

//CORDOVA
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  currentLocationDetails: any = null;
  loadingCheckIn: boolean = false;
  isWatchingLoc: boolean = false;
  watchLocSub: any = null;
  watchedLocations: any = [];

  constructor(
    private platform: Platform,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private geolocation:Geolocation,
    private diagnostic: Diagnostic,
  ) {}
  
  //CAPACITOR
  // async checkIn(){
  //   try {
  //     this.platform.ready().then(async ()=>{
  //       this.loadingCheckIn = true;
  //       this.currentLocationDetails = await Geolocation.getCurrentPosition();
  //       console.log(this.currentLocationDetails);
  //       this.loadingCheckIn = false;
  //     });
  //   } catch (error) {
  //     this.loadingCheckIn = false;
  //     console.error(error);
  //     const toast = await this.toastCtrl.create({
  //       message: 'An Error has occurred. Please try again.'
  //     });
  //     toast.present();
  //   }   
  // }

  //CORDOVA 
  async checkIn(){
    this.platform.ready().then(async ()=>{
      let isAuthorized = await this.diagnostic.isLocationAuthorized();
      let isEnabled = await this.diagnostic.isLocationEnabled();
      console.log('IS AUTHORIZE',isAuthorized);
      console.log('IS ENABLED',isEnabled);
      if(isAuthorized && isEnabled){
        this.loadingCheckIn = true;
        this.geolocation.getCurrentPosition()
        .then((resp)=>{
            this.loadingCheckIn = false;
            this.currentLocationDetails = resp;
            console.log(this.currentLocationDetails);
        })
        .catch(async (error)=>{
          this.loadingCheckIn = false;
          console.error(error);
          this.showToast(JSON.stringify(error));
        });
      } else {
        if(!isAuthorized){
          this.diagnostic.requestLocationAuthorization().then(()=>{
            this.checkIn();
          }).catch((error)=>{
            console.error(error);
            this.showToast(JSON.stringify(error));
          })
        }
        if(!isEnabled){
          this.diagnostic.switchToLocationSettings();
        }
      }
    });
  }

  watchLocation(){
    this.platform.ready().then(async ()=>{
      if(this.isWatchingLoc == false){
        let isAuthorized = await this.diagnostic.isLocationAuthorized();
        let isEnabled = await this.diagnostic.isLocationEnabled();
        console.log('IS AUTHORIZE',isAuthorized);
        console.log('IS ENABLED',isEnabled);
        if(isAuthorized && isEnabled){
          this.isWatchingLoc = true;
          this.watchLocSub = this.geolocation.watchPosition();
          this.watchLocSub.subscribe((data)=>{
            console.log(data);
            this.watchedLocations.push(data);
          });
        } else {
          if(!isAuthorized){
            this.diagnostic.requestLocationAuthorization().then(()=>{
              this.checkIn();
            }).catch((error)=>{
              console.error(error);
              this.showToast(JSON.stringify(error));
            })
          }
          if(!isEnabled){
            this.diagnostic.switchToLocationSettings();
          }
        }
      } else {
        if(this.watchLocSub){
          this.watchLocSub.unsubscribe();
          this.watchLocSub = null;
        }
        this.isWatchingLoc = false;
      }
    });
  }

  clearLocations(){
    this.watchedLocations = [];
  }

  async showToast(message){
    const toast = await this.toastCtrl.create({
      message: message
    });
    toast.present();
  }


}

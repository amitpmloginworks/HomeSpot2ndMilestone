import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, ModalController, ActionSheetController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { DiscoverPage } from '../pages/discover/discover';
import { LrReceiverPage} from '../pages/lr-receiver/lr-receiver';
import { CodecPage } from '../pages/codec/codec';
import{MenuPage} from '../pages/menu/menu';
import{ DeviceListPage } from '../pages/device-list/device-list';
import{ CustomizationPage } from '../pages/customization/customization';
import { ConnectionPage} from '../pages/connection/connection';
import { TimeoutsPage} from '../pages/timeouts/timeouts';
import { AdvancedPage} from '../pages/advanced/advanced';
import { FeatureRequestPage} from '../pages/feature-request/feature-request';
import {ContactUsPage } from '../pages/contact-us/contact-us';
import {AudioEffectPage } from '../pages/audio-effect/audio-effect';
import {ProductRegistrationPage } from '../pages/product-registration/product-registration';
import { DeviceSrcPage } from '../pages/device/device-src'
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage:any = DiscoverPage;

  constructor(
    public modalCtrl:ModalController,public actionSheetCtrl: ActionSheetController, private iab: InAppBrowser,  public menuCtrl: MenuController,
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen 
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  moveToDiscover(){
    this.nav.popToRoot();
  }
  moveToProductRegistration(){
    this.nav.push(ProductRegistrationPage);
  }
  moveToFeatureRequest(){
    this.nav.push(FeatureRequestPage);
  }
  moveToContactUs(){
    this.nav.push(ContactUsPage);
  }
  moveToCustomization(){
    this.nav.push(CustomizationPage);

  }
  moveToAudioEffect(){
   this.nav.push(AudioEffectPage);
  }
  moveToDeviceList(){
  // this.nav.setRoot(DeviceListPage);
  let profileModal = this.modalCtrl.create(DeviceListPage);
  profileModal.present();
   console.log("device");

  }

  openInBrowser(){
    const browser = this.iab.create('http://www.homespotdigital.com/');
  }
  unlink(){
    // let actionSheet = this.actionSheetCtrl.create({
    //   title: 'Unlink This Receiver. Are You Sure?',
    //   buttons: [
    //     {
    //       text: 'Unlink',
         
    //       handler: () => {
    //         console.log('Unlink clicked');
    //       }
    //     },
       
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: () => {
    //         console.log('Cancel clicked');
    //       }
    //     }
    //   ]
    // });
 
    // actionSheet.present();
  }
  goToLRReceiver(){
    this.menuCtrl.close();
    //this.nav.push(LrReceiverPage);
    console.log('LrReceiverPage');
  }
}

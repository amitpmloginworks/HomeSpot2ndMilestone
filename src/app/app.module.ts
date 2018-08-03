import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { DiscoverPage } from '../pages/discover/discover';
import { DeviceSnkPage } from '../pages/device/device-snk';
import { DeviceSrcPage } from '../pages/device/device-src';
import { FirmUpg8266Page } from '../pages/firm-upg-8266/firm-upg-8266';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataExchangerService } from '../providers/data-exchanger/data-exchanger.service';
import { AtCmdDispatcherService } from '../providers/atcmd-dispatcher/atcmd-dispatcher.service';


import { CodecPage } from '../pages/codec/codec';
import{ MenuPage } from '../pages/menu/menu';
import{ DeviceListPage } from '../pages/device-list/device-list';
import{ CustomizationPage } from '../pages/customization/customization';
import { ConnectionPage} from '../pages/connection/connection';
import { TimeoutsPage} from '../pages/timeouts/timeouts';
import { AdvancedPage} from '../pages/advanced/advanced';
import { FeatureRequestPage} from '../pages/feature-request/feature-request';
import { LrReceiverPage} from '../pages/lr-receiver/lr-receiver';
import {ContactUsPage } from '../pages/contact-us/contact-us';
import {AudioEffectPage } from '../pages/audio-effect/audio-effect';
import {ProductRegistrationPage } from '../pages/product-registration/product-registration';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { DatePicker } from '@ionic-native/date-picker';
import { BLE } from '@ionic-native/ble';
import { SocialSharing } from '@ionic-native/social-sharing';

import{model}from'./model'

@NgModule({
  declarations: [
    MyApp,
    DiscoverPage,
    DeviceSnkPage,
    DeviceSrcPage,
    FirmUpg8266Page,
 
    CodecPage,
    MenuPage,
    DeviceListPage,
    CustomizationPage,
    ConnectionPage,
    TimeoutsPage,
    AdvancedPage,
    FeatureRequestPage,
    LrReceiverPage,
    ContactUsPage,
    AudioEffectPage,
    ProductRegistrationPage

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DiscoverPage,
    DeviceSnkPage,
    DeviceSrcPage,
    FirmUpg8266Page,
    CodecPage,
    MenuPage,
    DeviceListPage,
    CustomizationPage,
    ConnectionPage,
    TimeoutsPage,
    AdvancedPage,
    FeatureRequestPage,
    LrReceiverPage,
    ContactUsPage,
    AudioEffectPage,
    ProductRegistrationPage
 
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DataExchangerService,
    AtCmdDispatcherService,
    NativePageTransitions,
    DatePicker,
    BLE,
    InAppBrowser,
    model,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},

  ]
})
export class AppModule {}

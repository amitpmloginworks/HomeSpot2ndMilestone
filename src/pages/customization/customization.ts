import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, Platform,LoadingController,ToastController  } from 'ionic-angular';
import {ConnectionPage} from '../connection/connection';
import {CodecPage } from '../codec/codec';
import {LrReceiverPage } from '../lr-receiver/lr-receiver';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AtCmdDispatcherService, BleDeviceInfo } from '../../providers/atcmd-dispatcher/atcmd-dispatcher.service';
import { ATCMDHDLQCCSNK } from '../../providers/atcmd-dispatcher/atcmd-handler-qcc-sink';
import { ThrowStmt } from '@angular/compiler';
import{Observable}from'rxjs/Rx'
import { Events } from 'ionic-angular';
import{model}from'../../app/model'
import { DiscoverPage } from '../discover/discover';
/**
* Generated class for the CustomizationPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
@IonicPage()
@Component({
selector: 'page-customization',
templateUrl: 'customization.html',
})
export class CustomizationPage {


protected devInfo : BleDeviceInfo;
protected pdlRecs : ATCMDHDLQCCSNK.PdlRec[] = [];
protected deviceState : string = "IDLE";
protected streamState : string = "STOP";
public volumeSyncValue;
public ledValue;
public bluetoothName;
protected qccSnkHandler : ATCMDHDLQCCSNK.AtCmdHandler_QCC_SNK = null;
protected han:ATCMDHDLQCCSNK.AtCmdRec_DN=null;
private bindedFunctions : {};
public slideOptions;  

constructor(public mod:model,public toastCtrl:ToastController,public menuCtrl:MenuController, public platform: Platform,public loadingCtrl:LoadingController,
private zone: NgZone,
public dispatcher : AtCmdDispatcherService,
public events: Events, public nativePageTransitions: NativePageTransitions, public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController) {
this.devInfo=mod.getdeviceinfo;
var refreshPdl : boolean = this.navParams.get('refreshPdl');
if( this.getHandler() )
{
var state = this.qccSnkHandler.atCmdDS.deviceState
this.deviceState = this.qccSnkHandler.atCmdDS.deviceStateStrs[state];
if( refreshPdl )
{
this.refreshPdl();
}
}
// Register for android's system back button
// let backAction =  platform.registerBackButtonAction(() => {
//   console.log("[DEVICE-SNK] user page close");
//   this.navCtrl.pop({animate: true, animation:'ios-transition', duration:500, direction:'back'});
//   backAction();
// },2)
}


ionViewDidLoad() {
console.log('ionViewDidLoad CustomizationPage');
}


ionViewWillEnter() {
console.log('ion will Enter')
//closing right side menu
this.menuCtrl.swipeEnable( false, 'menu2' );
var fn : any;
this.bindedFunctions = {};
fn = this.handleBleDevChanged.bind(this);
this.events.subscribe('BLE_DEV_CHANGED', fn);
this.bindedFunctions['BLE_DEV_CHANGED'] = fn;
fn = this.handleDeviceStateChanged.bind(this);
this.events.subscribe('QCC_SNK_DEVICE_STATE_CHANGED', fn);
this.bindedFunctions['QCC_SNK_DEVICE_STATE_CHANGED'] = fn;
this.getSleepMode();
this.getVolumeSync();
this.getBluetoothName();
}


ionViewDidLeave()
{
for( var key in this.bindedFunctions )
{
var fn = this.bindedFunctions[key];
this.events.unsubscribe(key, fn);
}
this.bindedFunctions = null;
}


ionViewDidEnter(){
var fn : any;
this.bindedFunctions = {};
fn = this.handleBleDevChanged.bind(this);
this.events.subscribe('BLE_DEV_CHANGED', fn);
this.bindedFunctions['BLE_DEV_CHANGED'] = fn;
}


ionViewWillLeave() {
let options: NativeTransitionOptions = {
direction: 'left',
duration: 400,
slowdownfactor: -1,
slidePixels: 0,
iosdelay: 100,
androiddelay: 250,
fixedPixelsTop: 0,
fixedPixelsBottom: 0
}; 
this.slideOptions=options;
}


private handleBleDevChanged(params)
{
//console.log('[DEVICE-SNK]', JSON.stringify(params));
if( params.name == 'QCC_SNK' && params.action == 'disconnect' )
{
console.log("[DEVICE-SNK] disconnect page close");
this.zone.run(() => {
//this.navCtrl.pop({animate: true, animation:'ios-transition', duration:500, direction:'back'});
// this.navCtrl.popAll();
this.navCtrl.popToRoot({animate: true, animation:'ios-transition', duration:500, direction:'back'})
});
}
}


private handleDeviceStateChanged(params)
{
console.log('[DEVICE-SNK] device state changed: ' + JSON.stringify(params));
this.zone.run( () => {
this.deviceState = params.state;
});
// Update PDL since device state has changed
this.qccSnkHandler.refreshPdl();        
}
private getHandler() : boolean
{
//this.devInfo = this.navParams.get('devInfo');
if( this.qccSnkHandler == null )
{
this.qccSnkHandler = 
<ATCMDHDLQCCSNK.AtCmdHandler_QCC_SNK>
this.dispatcher.getCmdChHandler(this.devInfo.uuid);
}
else
{
return true;
}
if( this.qccSnkHandler == null )
{
console.log("[DEVICE-SNK] error page close");
//  this.navCtrl.pop({animate: true, animation:'ios-transition', duration:500, direction:'back'});
//this.navCtrl.popAll();
this.navCtrl.popToRoot({animate: true, animation:'ios-transition', duration:500, direction:'back'})
return false;
}    
return true;
}



//Navigate to Connection Page  
private moveToConnection(){
this.nativePageTransitions.slide(this.slideOptions)
this.navCtrl.push(ConnectionPage, {'devInfo' :this.devInfo} );
}


// Navigate to Code Page
private moveToCodec(){
this.nativePageTransitions.slide(this.slideOptions)
this.navCtrl.push(CodecPage);
}


// Navigate To LRReceiver Page
private goToLRReceiver(){
let options:NativeTransitionOptions={
direction:'right',
duration:500,
slowdownfactor:-1,
slidePixels:0
}
this.menuCtrl.swipeEnable( true, 'menu2' );
this.nativePageTransitions.slide(options);
this.navCtrl.pop();
}


private setBluetoothName(){
let alert = this.alertCtrl.create({
title: 'Bluetooth Name',
subTitle:'Enter a new receiver name',
inputs: [
{
name: 'username',
placeholder: 'LR-Receiver-1234'
},
],
buttons: [
{
text: 'Cancel',
role: 'cancel',
handler: data => {
console.log('Cancel clicked');
}
},
{
text: 'Done',
handler: data => {
console.log('Done clicked');
this.rename(data.username)
}
}
]
});
alert.present();
}
refreshPdl()
{
this.zone.run( () => {
this.pdlRecs = [];
});
//console.log("[DEVICE-SNK] refresh PDL [" + linkedList[foundIdx].uuid + "][" + linkedList[foundIdx].name + "]");
console.log("[DEVICE-SNK] refresh PDL [" + this.devInfo.uuid + "][" + this.devInfo.name + "]");
if( !this.getHandler() )
{
return;
}
this.qccSnkHandler.refreshPdl().then( ret => {
console.log("[DEVICE-SNK] refresh PDL success " + JSON.stringify(ret));
}).catch( ret => {
console.log("[DEVICE-SNK] refresh PDL fail " + JSON.stringify(ret));
});
}


private rename(name){
console.log(name);
console.log(this.qccSnkHandler)
let rename=this.qccSnkHandler.setLocalBluetoothName(name).then( ret => {
console.log("[DEVICE-SNK] set Local Bluetooth Name success " + JSON.stringify(ret));
this.presentToast("Success");
}).catch( ret => {
console.log("[DEVICE-SNK] set Local Bluetooth Name fail " + JSON.stringify(ret));
this.presentToast("Timeout Expired");
});
console.log('rename', rename);
setTimeout(()=>{
this.getBluetoothName();
},2000) 
}


private getBluetoothName(){
let rename=this.qccSnkHandler.getLocalBluetoothName().then( ret => {
console.log("[DEVICE-SNK] Get Local Bluetooth Name Success " + JSON.stringify(ret));
this.bluetoothName=JSON.stringify(ret)
}).catch( ret => {
console.log("[DEVICE-SNK] Get Local Bluetooth Name Fail " + JSON.stringify(ret));
});;
console.log('Get Bluetooth Name', rename);
}
private volumeSync($event, volume){
this.qccSnkHandler.setVolumeSync(volume).then( ret => {
console.log("[DEVICE-SNK] set Up Volume Sync success " + JSON.stringify(ret));
if(volume==true)
{
this.presentToast("Turned On");
this.volumeSyncValue="true"
}
else
{
this.presentToast("Turned Off");
this.volumeSyncValue="false"
}
}).catch( ret => {
console.log("[DEVICE-SNK] set Up Volume Sync fail " + JSON.stringify(ret));
this.presentToast("Timeout Expired");
});
}


private sleepMode($event, led){
this.qccSnkHandler.setSleepMode(led).then( ret => {
console.log("[DEVICE-SNK] set Sleep Mode success " + JSON.stringify(ret));  
if(led==true)
{
this.presentToast("Turned On");
this.ledValue="true"
}
else
{
this.presentToast("Turned Off");
this.ledValue="false"
}
}).catch( ret => {
console.log("[DEVICE-SNK] set Sleep Mode fail " + JSON.stringify(ret));
this.presentToast("Timeout Expired");
});
}


private getSleepMode(){
this.qccSnkHandler.getSleepMode().then( ret => {
console.log("[DEVICE-SNK] get Sleep Mode success " + JSON.stringify(ret));
if(JSON.stringify(ret)=="1" ||JSON.stringify(ret)=="true" ){
this.ledValue="true"
}
else
this.ledValue="false"
}).catch( ret => {
console.log("[DEVICE-SNK] get Sleep Mode fail " + JSON.stringify(ret));
});
}


private getVolumeSync(){
this.qccSnkHandler.getVolumeSync().then( ret => {
console.log("[DEVICE-SNK] get Up Volume Sync success " + JSON.stringify(ret));
if(JSON.stringify(ret)=="1" ||JSON.stringify(ret)=="true" ){
this.volumeSyncValue="true"
}
else
this.volumeSyncValue="false"
}).catch( ret => {
console.log("[DEVICE-SNK] get Up Volume Sync fail " + JSON.stringify(ret));
});
}


presentToast(msg) {
let toast = this.toastCtrl.create({
message: msg,
duration: 3000,
position: 'bottom'
});
toast.onDidDismiss(() => {
console.log('Dismissed toast');
});
toast.present();
}

}//end
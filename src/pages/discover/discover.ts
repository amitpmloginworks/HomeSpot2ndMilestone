import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, Events, ModalController } from 'ionic-angular';
import { NavController, IonicPage, MenuController, AlertController, ActionSheetController, ToastController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import {LrReceiverPage } from '../lr-receiver/lr-receiver';
import { AtCmdDispatcherService, BleDeviceInfo } from '../../providers/atcmd-dispatcher/atcmd-dispatcher.service';
import {CustomizationPage} from '../../pages/customization/customization';
import { DeviceSnkPage } from '../../pages/device/device-snk'
import { DeviceSrcPage } from '../../pages/device/device-src'
import { FirmUpg8266Page } from '../../pages/firm-upg-8266/firm-upg-8266'
import { BLE } from '@ionic-native/ble';
import { DeviceListPage} from '../../pages/device-list/device-list';
import{model}from'../../app/model'
@Component({
selector: 'page-discover',
templateUrl: 'discover.html'
})

export class DiscoverPage 
{

slideOptions : any;
private connectOrDisconnect:any;
private isdeviceConnected:any;
private connectedDeviceColor:any;
unlinkDevInfos : BleDeviceInfo[];
linkedDevInfos : BleDeviceInfo[];
private bindedFunctions : {};
connectingDevInfos : { uuid : string, BleDeviceInfo };
connectingPrompt : any = null;

constructor(
public mod:model,
public platform: Platform, 
private zone: NgZone,
public events : Events,
public navCtrl: NavController,
public alertCtrl : AlertController,
public dispatcher : AtCmdDispatcherService,
private nativePageTransitions: NativePageTransitions,
public menuCtrl:MenuController,
private ble: BLE,
public actionSheetCtrl:ActionSheetController,
private toastCtrl: ToastController,
public modalCtrl:ModalController
) 
{
this.isdeviceConnected=1;
this.connectingDevInfos = <{ uuid : string, BleDeviceInfo }>{};
events.subscribe('BLE_DEV_CHANGED', this.handleBleDevChanged.bind(this));
this.dispatcher.bleInit( sysEvtObj => {
console.log("[DISCOVER] SysEvt: " + JSON.stringify(sysEvtObj));  
// Add code here to handle BLE on/off events
//
}).then( successObj => {
console.log("[DISCOVER] DX init OK " + JSON.stringify(successObj));
}).catch( failureObj => {
console.log("[DISCOVER] DX init failed " + JSON.stringify(failureObj));
});
this.unlinkDevInfos = [];
this.linkedDevInfos = this.dispatcher.getLinkedDevices();
ble.enable();
}

ionViewDidLoad() {
this.platform.ready().then(() => {
// Okay, so the platform is ready and our plugins are available.
// Here you can do any higher level native things you might need.
});
}

handleBleDevChanged(params)
{
//console.log('[DISCOVER]', JSON.stringify(params));
if( params.name != 'QCC_SNK' && params.name != 'QCC_SRC' && params.name != 'DXS' )
{
return;
}
if( params.name == 'QCC_SNK' && params.action == 'disconnect' )
{
this.isdeviceConnected=0
//  document.getElementById("connectedDevice").style.background="rgb(76,92,105)"
}
// Update the device list UI
this.zone.run(()=>{
this.linkedDevInfos = this.dispatcher.getLinkedDevices();
this.unlinkDevInfos = this.dispatcher.getUnlinkDevices();
});
if( this.connectingPrompt == null )
{
return;
}
var activateFailedPrompt : boolean = false;
if( params.name ==  "QCC_SNK" && params.action == "connect" )
{
this.isdeviceConnected=1;
this.connectingPrompt.dismiss();
this.connectingPrompt = null; 
var devInfo = this.connectingDevInfos[params.uuid];
this.mod.getdeviceinfo=devInfo
if( devInfo == null )
{ 
activateFailedPrompt = true;
}
else
{
console.log("[DISCOVER] connect QCC-SNK");
console.log('dev',devInfo );
this.navCtrl.push(LrReceiverPage, {'devInfo' : devInfo}, {animate: true, animation:'ios-transition', duration:500, direction:'forward'});
delete this.connectingDevInfos[params.uuid];
}
}
else if( params.name ==  "QCC_SRC" && params.action == "connect" )
{
this.connectingPrompt.dismiss();
this.connectingPrompt = null;
var devInfo = this.connectingDevInfos[params.uuid];
if( devInfo == null )
{
activateFailedPrompt = true;
}
else
{
console.log("[DISCOVER] connect QCC-SRC");
this.navCtrl.push(DeviceSrcPage, {'devInfo' : devInfo}, {animate: true, animation:'ios-transition', duration:500, direction:'forward'});
delete this.connectingDevInfos[params.uuid];
}
}
else if( params.name ==  "DXS" && params.action == "connect" )
{
this.connectingPrompt.dismiss();
this.connectingPrompt = null;
var devInfo = this.connectingDevInfos[params.uuid];
if( devInfo == null )
{
activateFailedPrompt = true;
}
else
{
console.log("[DISCOVER] connect DXS");
this.navCtrl.push(FirmUpg8266Page, {'devInfo' : devInfo}, {animate: true, animation:'ios-transition', duration:500, direction:'forward'});
delete this.connectingDevInfos[params.uuid];
}
}
if( activateFailedPrompt )
{
let prompt = this.alertCtrl.create({
title: 'Connect failed [internal error]',
buttons: [
{
text: 'Ok'
}
]
});
prompt.present();
}
}


scanRefresh(refresher)
{
// Empty the list
this.linkedDevInfos = this.dispatcher.getLinkedDevices();
JSON.stringify(this.linkedDevInfos);
for(var i=0; i<this.linkedDevInfos.length; i++){
var deviceConnected=this.linkedDevInfos[i].isConnected();
console.log("device connected.... ", deviceConnected );
if( deviceConnected ){
this.isdeviceConnected=1;
}
else{
this.isdeviceConnected=0; 
}
}
this.unlinkDevInfos = [];
setTimeout(() => {
this.dispatcher.bleStopScan();
refresher.complete();
}, 3000);
this.dispatcher.bleStartScan(
successObj => {
//console.log("[HOME] scan success " + JSON.stringify(successObj));
// Add code here to process the scan result. 
// - for example, update the device list UI
// - check for successObj.active for the device availability. If false,
//   it means the device is no longer available (i.e. not advertising 
//   any more), therefore it cannot be connected 
this.zone.run(() => {
this.linkedDevInfos = this.dispatcher.getLinkedDevices();
this.unlinkDevInfos = this.dispatcher.getUnlinkDevices();
//console.log( "[DISCOVER] " + JSON.stringify(this.linkedDevInfos));
//console.log( "[DISCOVER] " + JSON.stringify(this.unlinkDevInfos));
});
},
failureObj => {
console.log("[DISCOVER] scan failure " + failureObj.status);
}
);
}


//connect to the device
private connectDevice(item, devInfo)
{
if( devInfo.isConnected() )
{
this.navCtrl.push(LrReceiverPage, {'devInfo' : devInfo, 'refreshPdl' : true}, {animate: true, animation:'ios-transition', duration:500, direction:'forward'});
return;
}
this.connectingPrompt = this.alertCtrl.create({
title: 'Connecting'
});
this.connectingPrompt.present();
this.connectingDevInfos[devInfo.uuid] = devInfo;
console.log("[DISCOVER] Connecting [" + devInfo.uuid + "][" + devInfo.name + "]");
this.dispatcher.bleConnect(devInfo.uuid, 10000).then( ret => {
console.log("[DISCOVER] Connected [" + ret.status + "]");
this.isdeviceConnected=1;
}).catch( ret => {
this.connectingPrompt.dismiss();
this.connectingPrompt = null;
console.log("[DISCOVER] Connect fail [" + ret.status + "]");
this.isdeviceConnected=0;
let prompt = this.alertCtrl.create({
title: 'Connect failed [' + ret.status + ']',
buttons: [
{
text: 'Ok'
}
]
});
prompt.present();
});
}


public disconnectDevice(item, devInfo)
{ 
console.log('disconnect called')
if( !devInfo.isConnected() )
{
return;
}
this.presentToast("Disconnected Successfully");
this.isdeviceConnected=0;
//  document.getElementById("connectedDevice").style.background="rgb(76,92,105)"
console.log("[DISCOVER] Disconnecting [" + devInfo.uuid + "][" + devInfo.name + "]");
this.dispatcher.bleDisconnect(devInfo.uuid).catch( ret => {
console.log("[DISCOVER] Disconnect fail " + JSON.stringify(ret));
});
this.zone.run(() => {
this.linkedDevInfos = this.dispatcher.getLinkedDevices();
this.unlinkDevInfos = this.dispatcher.getUnlinkDevices();
});
}


//open left menu
openLeftMenu(){
this.menuCtrl.enable(true, 'authenticated');
this.menuCtrl.enable(false, 'unauthenticated');
}


//removing the device
private removeDevice(item, devInfo)
{
console.log("[DISCOVER] removing device [" + devInfo.uuid + "][" + devInfo.name + "]");
this.dispatcher.removeLinkedDevice(devInfo.uuid);
this.zone.run(() => {
this.linkedDevInfos = this.dispatcher.getLinkedDevices();
this.unlinkDevInfos = this.dispatcher.getUnlinkDevices();
});
}


ionViewWillEnter() {
console.log('ion will Enter')
this.menuCtrl.swipeEnable( false, 'menu2' );
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
var fn : any;
this.bindedFunctions = {};
fn = this.handleBleDevChanged.bind(this);
this.events.subscribe('BLE_DEV_CHANGED', fn);
this.bindedFunctions['BLE_DEV_CHANGED'] = fn;
}

// If device is connected go to Lr receiver else connect device
goToLRReceiver(devInfo){
if(devInfo.isConnected()){
this.nativePageTransitions.slide(this.slideOptions)
this.navCtrl.push(LrReceiverPage, {'devInfo' : devInfo});
}
else{
this.connectDevice('item', devInfo);
}
}
presentAlert(title, subTiltle){
let alert = this.alertCtrl.create({
title: 'Connection Alert',
subTitle:  subTiltle,
buttons: ['Dismiss']
});
alert.present();
}
conn(){
alert('success');
}

//connecting options
private connectOptions(item, devInfo){
if(devInfo.isConnected()){
this.connectOrDisconnect="Disconnect"
}
else{
this.connectOrDisconnect="Connect"
}
let actionSheet = this.actionSheetCtrl.create({
title: 'HomeSpot Device Actions',
buttons: [
{
text:  this.connectOrDisconnect,
handler: () => {
if(this.connectOrDisconnect=='Disconnect'){
this.disconnectDevice(item, devInfo)
}
else{
this.connectDevice(item, devInfo)
console.log('Disconnect');
}
}
},
// {
//   text: 'Rename',
//   handler: () => {
//     this.rename(devInfo.uuid, 'test');
//     console.log('Rename');
//   }
// },
{
text: 'Forget',
handler: () => {
this. removeDevice(item, devInfo);
console.log('Forget');
}
},
{
text: 'Cancel',
role: 'cancel',
handler: () => {
console.log('Cancel clicked');
}
}
]
});
actionSheet.present();
}



presentToast(msg) {
let toast = this.toastCtrl.create({
message: msg,
duration: 3000,
position: 'top'
});
toast.onDidDismiss(() => {
console.log('Dismissed toast');
});
toast.present();
}
}//end
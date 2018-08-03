import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, MenuController,Platform, Events } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AtCmdDispatcherService, BleDeviceInfo } from '../../providers/atcmd-dispatcher/atcmd-dispatcher.service';
import { ATCMDHDLQCCSNK } from '../../providers/atcmd-dispatcher/atcmd-handler-qcc-sink';
import {DeviceListPage } from '../device-list/device-list';
import {AudioEffectPage } from '../audio-effect/audio-effect';
import {DiscoverPage } from '../discover/discover';
import{model}from'../../app/model'
import {Observable} from 'rxjs/Observable';
/**
* Generated class for the LrReceiverPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
@IonicPage()
@Component({
selector: 'page-lr-receiver',
templateUrl: 'lr-receiver.html',
})

export class LrReceiverPage {


private slideOptions;
private backOptions;
private on;
private start;
private isSignal;
private signalBarOne;
private signalBarTwo;
private signalBarThree;
private signalBarFour;
private signalBarFive;
private codecStateAptx:any;
private codecStateAptxll:any;
private volume:any;
protected devInfo : BleDeviceInfo;
protected pdlRecs : ATCMDHDLQCCSNK.PdlRec[] = [];
protected deviceState : string = "IDLE";
protected streamState : string = "STOP";
private volumeSyncValue;
public pairingButtonColor : string = "dark"
private timer;
private devicename;
private connectiondevice;
private rssiTimer : any = null;
private isPlaying : any='0'
protected qccSnkHandler : ATCMDHDLQCCSNK.AtCmdHandler_QCC_SNK = null;
private bindedFunctions : {};


constructor(public navCtrl: NavController,public platform: Platform,
private zone: NgZone,
public dispatcher : AtCmdDispatcherService,
public mod:model,
public events: Events, public toastCtrl:ToastController, private nativePageTransitions: NativePageTransitions, public menuCtrl:MenuController, public navParams: NavParams, public modalCtrl: ModalController) {
this.isSignal=0;
this. signalBarOne=0;
this.signalBarTwo=0;
this.signalBarThree=0;
this.signalBarFour=0;
this.signalBarFive=0;
var refreshPdl ="true"
this.devInfo=mod.getdeviceinfo
this.menuCtrl.enable(true, 'menu2')
this.menuCtrl.swipeEnable(true, 'menu2')
localStorage['devInfo']=this.navParams.get('devInfo');
this.on=0;
this.start="true";
this.events.publish('user:created',localStorage['devInfo'], Date.now()); 
this.devicename='None'
if( this.getHandler() )
{
var state = this.qccSnkHandler.atCmdDS.deviceState
this.deviceState = this.qccSnkHandler.atCmdDS.deviceStateStrs[state];
if( refreshPdl )
{
console.log("if refresh", refreshPdl)
this.refreshPdl();
}
}
// // Register for android's system back button
// // let backAction =  platform.registerBackButtonAction(() => {
// //   console.log("[DEVICE-SNK] user page close");
// //   this.navCtrl.pop({animate: true, animation:'ios-transition', duration:500, direction:'back'});
// //   backAction();
// // },2)
}



ionViewWillEnter() {
var fn : any;
this.bindedFunctions = {};
fn = this.handleBleDevChanged.bind(this);
this.events.subscribe('BLE_DEV_CHANGED', fn);
this.bindedFunctions['BLE_DEV_CHANGED'] = fn;
fn = this.handlePdlChanged.bind(this);
this.events.subscribe('QCC_SNK_PDL_CHANGED', fn);
this.bindedFunctions['QCC_SNK_PDL_CHANGED'] = fn;
fn=this.volumeChanged.bind(this);
this.events.subscribe('QCC_SNK_VOLUME_CHANGED', fn);
this.bindedFunctions['QCC_SNK_VOLUME_CHANGED'] = fn;
fn = this.handleDeviceStateChanged.bind(this);
this.events.subscribe('QCC_SNK_DEVICE_STATE_CHANGED', fn);
this.bindedFunctions['QCC_SNK_DEVICE_STATE_CHANGED'] = fn;
fn = this.handleStreamStateChanged.bind(this);
this.events.subscribe('QCC_SNK_STREAM_STATE_CHANGED', fn);
this.bindedFunctions['QCC_SNK_STREAM_STATE_CHANGED'] = fn;
//this.refresh();
this.menuCtrl.swipeEnable( true, 'menu2' );
this.refreshpdl();
this.getVolumeSync();
this.getPlayState();
this.getVolume();
//    Refresh active devices' RSSI every 5s
this.rssiTimer = setInterval(() => {
this.qccSnkHandler.refreshPdlRssi();  
this.zone.run( () => {
for(var i=0;i<this.pdlRecs.length;i++)
{
if(this.pdlRecs[i].isMusicConnected==1)
{
var rssiValue=this.pdlRecs[i].rssi
console.log("rssiValue------",rssiValue)
if(rssiValue <= 0 && rssiValue >= -25){
this.signalBarOne=1;
this.signalBarTwo=1;
this.signalBarThree=1;
this.signalBarFour=1;
this.signalBarFive=1;
console.log("rssiValue1-----------------",rssiValue)
return;
}
else if(rssiValue <= -26 && rssiValue >= -50){
this.signalBarOne=1;
this.signalBarTwo=1;
this.signalBarThree=1;
this.signalBarFour=1;
this.signalBarFive=0;
console.log("rssiValue2-----------------",rssiValue)
return;
}
else if(rssiValue <= -51 && rssiValue >= -75){
this.signalBarOne=1;
this.signalBarTwo=1;
this.signalBarThree=1;
this.signalBarFour=0;
this.signalBarFive=0;
console.log("rssiValue3-----------------",rssiValue)
return;
}
else if(rssiValue <= -76 && rssiValue >= -100){
this.signalBarOne=1;
this.signalBarTwo=1;
this.signalBarThree=0;
this.signalBarFour=0;
this.signalBarFive=0;
console.log("rssiValue4-----------------",rssiValue)
return;
}
else if(rssiValue <= -101 && rssiValue >= -128){
this.isSignal=1;
this. signalBarOne=1;
this.signalBarTwo=0;
this.signalBarThree=0;
this.signalBarFour=0;
this.signalBarFive=0;
console.log("rssiValue5-----------------",rssiValue)
return;
}
else {
this.isSignal=0;
this.signalBarOne=0;
this.signalBarTwo=0;
this.signalBarThree=0;
this.signalBarFour=0;
this.signalBarFive=0;
console.log("rssiValue6-----------------",rssiValue)
return;
}
}
} 
});      
}, 5000);
}


//volume changed Event
volumeChanged(params){
console.log('[DEVICE-SNK] volume changed Event: ' + JSON.stringify(params));
this.zone.run( () => {
this.volume=params.volume
console.log("volume Level", this.volume);
});
}

ionViewWillLeave() {
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
let backOptions: NativeTransitionOptions = {
direction: 'back',
duration: 400,
slowdownfactor: -1,
slidePixels: 0,
iosdelay: 100,
androiddelay: 250,
fixedPixelsTop: 0,
fixedPixelsBottom: 0
}; 
this.slideOptions=options;
this.backOptions=backOptions;

//stop the refresh Rssi 
clearInterval(this.rssiTimer);
}


moveToDeviceList(){
let options: NativeTransitionOptions = {
direction: 'up',
duration: 400,
slowdownfactor: -1,
slidePixels: 0,
iosdelay: 100,
androiddelay: 250,
fixedPixelsTop: 0,
fixedPixelsBottom: 0
}; 
this.nativePageTransitions.slide(options )
let modal = this.modalCtrl.create(DeviceListPage, {'devInfo' :this.devInfo});
modal.present();
}

//Navigate to Audio Effect Page
private moveToAudioEffect(){
this.nativePageTransitions.slide(this.slideOptions )
this.navCtrl.push(AudioEffectPage);
}

private handlePdlChanged(params)
{
console.log('[DEVICE-SNK] PDL changed: ' + JSON.stringify(params));
this.zone.run(() => {
this.pdlRecs = params.pdl;
for(var i=0;i<this.pdlRecs.length;i++)
{
if(this.pdlRecs[i].isMusicConnected==1)
{
this.devicename=this.pdlRecs[i].remoteDevName
this.connectiondevice=this.pdlRecs[i].addr
}
else
this.isSignal=0;
this.signalBarOne=0;
this.signalBarTwo=0;
this.signalBarThree=0;
this.signalBarFour=0;
this.signalBarFive=0;
} 
});
}

// Navigate To Home
private moveToHome(){
if(this.navCtrl.canGoBack()){
let options:NativeTransitionOptions={
direction:'right',
duration:500,
slowdownfactor:-1,
slidePixels:0
}
this.nativePageTransitions.slide(options);  
this.navCtrl.pop();
}
else{
console.log('else');
let options:NativeTransitionOptions={
direction:'right',
duration:500,
slowdownfactor:-1,
slidePixels:0
}
this.nativePageTransitions.slide(options);
this.navCtrl.pop();
}
}


openRightMenu(){
this.menuCtrl.enable(false, 'authenticated');
console.log("open right");
this.menuCtrl.enable(true, 'unauthenticated');
}
syncOnOff(value){
this.qccSnkHandler.setVolumeSync(value).then( ret => {
if(value){
this.on=1
this.presentToast("Turned On")
}
else{
this.on=0
this.presentToast("Turned Off")        
}
console.log("[DEVICE-SNK] set Up Volume Sync success " + JSON.stringify(ret));
}).catch( ret => {
this.presentToast("Timeout Expired")
console.log("[DEVICE-SNK] set Up Volume Sync fail " + JSON.stringify(ret));
});
}


ionViewDidLeave(){
for( var key in this.bindedFunctions )
{
var fn = this.bindedFunctions[key];
this.events.unsubscribe(key, fn);
}
this.bindedFunctions = null;
}
private handleBleDevChanged(params)
{
//console.log('[DEVICE-SNK]', JSON.stringify(params));
if( params.name == 'QCC_SNK' && params.action == 'disconnect' )
{
console.log("[DEVICE-SNK] disconnect page close");
//this.navCtrl.pop({animate: true, animation:'ios-transition', duration:500, direction:'back'});
this.navCtrl.popToRoot({animate: true, animation:'ios-transition', duration:500, direction:'back'})
}
}
private handleDeviceStateChanged(params)
{
console.log('[DEVICE-SNK] device state changed: ' + JSON.stringify(params));
this.zone.run( () => {
this.deviceState = params.state;
this.pairingButtonColor = this.deviceState == 'DISCOVERABLE' ?"danger" :"dark";
});
// Update PDL since device state has changed
this.qccSnkHandler.refreshPdl();        
}


private handleStreamStateChanged(params)
{
console.log('[DEVICE-SNK] stream state changed: ' + JSON.stringify(params));
this.zone.run( () => {
for(var i=0;i<this.pdlRecs.length;i++)
{
if(this.pdlRecs[i].isMusicConnected==1)
{
this.devicename=this.pdlRecs[i].remoteDevName
console.log("device name",this.devicename);
}
}
if(params.codec=="APTX"){
this. codecStateAptx="1"
this.codecStateAptxll="0"
console.log("codec state",  this.codecStateAptx);
}
else if(params.codec=="APTX-ll"){
this. codecStateAptxll="1"
this. codecStateAptx="0"
}
if( params.action == 'connect' )
{
this.isPlaying='1' 
this.streamState = params.codec;
}
else
{
this.streamState = 'STOP';
this.isPlaying='0'
}
});
// Update PDL since device state has changed
this.qccSnkHandler.refreshPdl();    
}



private getHandler() : boolean
{
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
if( this.qccSnkHandler == null ){
// Handler is not any more
// - likely the device is disconnected
// - pop this page and let th parent to handle it
console.log("[DEVICE-SNK] error page close");
//  this.navCtrl.pop({animate: true, animation:'ios-transition', duration:500, direction:'back'});
//  this.navCtrl.popAll();
this.navCtrl.popToRoot({animate: true, animation:'ios-transition', duration:500, direction:'back'})
return false;
}    
return true;
}



refreshPdl()
{
this.zone.run( () => {
this.pdlRecs = [];
console.log("pdlrecs",this.pdlRecs);
});
//console.log("[DEVICE-SNK] refresh PDL [" + linkedList[foundIdx].uuid + "][" + linkedList[foundIdx].name + "]");
console.log("[DEVICE-SNK] refresh PDL [" + this.devInfo.uuid + "][" + this.devInfo.name + "]");
if( !this.getHandler() )
{
return;
}
this.qccSnkHandler.refreshPdl().then( ret => {
console.log("[DEVICE-SNK] refresh PDL success " + JSON.stringify(ret));
//this.pdlRecs = ret.pdl;
}).catch( ret => {
console.log("[DEVICE-SNK] refresh PDL fail " + JSON.stringify(ret));
});
}

//change Volume Level
private changeRange(Volume){
console.log(Volume);
this.qccSnkHandler.setVolume(Volume).then( ret => {
console.log("[DEVICE-SNK] Set Volume success " + JSON.stringify(ret));
}).catch( ret => { 
console.log("[DEVICE-SNK] Set Volume fail " + JSON.stringify(ret));
});  
}


// play next Audio track
private next(){
this.qccSnkHandler.setAudioTrack(1).then( ret => {
console.log("[DEVICE-SNK] Set audio track success " + JSON.stringify(ret));
}).catch( ret => {
this.presentToast("Timeout Expired");
console.log("[DEVICE-SNK] Set audio track fail " + JSON.stringify(ret));
});
}

// Previous Audio Track
previous(){
this.qccSnkHandler.setAudioTrack(0).then( ret => {
console.log("[DEVICE-SNK] Set audio track success " + JSON.stringify(ret));
// this.presentToast("Success");
}).catch( ret => {
this.presentToast("Timeout Expired");
console.log("[DEVICE-SNK] Set audio track fail " + JSON.stringify(ret));
});
}

// set Play or pause
private playState(isPlayingValue){
var stream=this.streamState
console.log("stream...........",this.streamState)
if(isPlayingValue){
this.zone.run(() => {
this.isPlaying=1;
});
this.qccSnkHandler.setPlayState(1).then( ret => {
console.log("[DEVICE-SNK] Set Paly State Success " + JSON.stringify(ret));
}).catch( ret => {
this.presentToast("Timeout Expired");
console.log("[DEVICE-SNK] Set Paly State  fail " + JSON.stringify(ret));
});
}
else{  
this.zone.run(() => {
this.isPlaying='0'
});
this.qccSnkHandler.setPlayState(0).then( ret => {
console.log("[DEVICE-SNK] Set Paly State Success " + JSON.stringify(ret));
}).catch( ret => {
this.presentToast("Timeout Expired");
console.log("[DEVICE-SNK] Set Paly State  fail " + JSON.stringify(ret));
}); 
}
}

// volume Sync
private setVolumeSync($event, volume){
console.log(volume);
this.qccSnkHandler.setVolumeSync(volume).then( ret => {
if(volume){
this.on=0;
}
else{
this.on=1;
}
console.log("[DEVICE-SNK] set Up Volume Sync success " + JSON.stringify(ret));
}).catch( ret => {
this.presentToast("Timeout Expired");
console.log("[DEVICE-SNK] set Up Volume Sync fail " + JSON.stringify(ret));
});
}


//get value of Volume Sync
private getVolumeSync(){
this.qccSnkHandler.getVolumeSync().then( ret => {
console.log("[DEVICE-SNK] get Up Volume Sync success " + JSON.stringify(ret));
if(JSON.stringify(ret)=="1" ||JSON.stringify(ret)=="true" ){
this.on=1;
}
else
this.on=0;
}).catch( ret => {
console.log("[DEVICE-SNK] get Up Volume Sync fail " + JSON.stringify(ret));
});
}

//play State

private getPlayState(){
this.qccSnkHandler.getPlayState().then( ret => {
console.log("[DEVICE-SNK] getPlay State success " + JSON.stringify(ret));
if(JSON.stringify(ret)=="1" ||JSON.stringify(ret)=="true" ){
this.isPlaying='1'
console.log("isPlaying",this.isPlaying);
}
else{
this.isPlaying='0'
console.log("isPlaying1",this.isPlaying);
}   
}).catch( ret => {
console.log("[DEVICE-SNK] get Play State fail " + JSON.stringify(ret));
});
}

presentToast(msg) {
let toast = this.toastCtrl.create({
message: msg,
duration: 4000,
position: 'bottom'
});
toast.onDidDismiss(() => {
console.log('Dismissed toast');
});
toast.present();
}


refreshRSSI(addr){
this.qccSnkHandler.refreshRssi(addr).then( ret => {
console.log("[DEVICE-SNK] Refresh RSSI success " + JSON.stringify(ret));
if(JSON.stringify(ret)=="1" ||JSON.stringify(ret)=="true" ){
}
else{
}
}).catch( ret => {
console.log("[DEVICE-SNK] Refresh RSSI fail " + JSON.stringify(ret));
});
setTimeout(()=>{
this.refresh(addr);
},10000)
}


refresh(addr){
console.log("address-----------------", addr)
this.refreshRSSI(addr);
}


refreshpdl(){
this.qccSnkHandler.refreshPdl().then( ret => {
console.log("[DEVICE-SNK] Refresh PDL>>>>> success " + JSON.stringify(ret));
}).catch( ret => {
console.log("[DEVICE-SNK] Refresh PDL>>>> fail " + JSON.stringify(ret));
}); 
}


private getVolume(){
this.qccSnkHandler.getVolume().then( ret => {
console.log("[DEVICE-SNK] get Volume success " + JSON.stringify(ret));
this.zone.run(() => {
this.volume= JSON.stringify(ret)
});
}).catch( ret => {
console.log("[DEVICE-SNK] get Volume fail " + JSON.stringify(ret));
}); 
}
}//end
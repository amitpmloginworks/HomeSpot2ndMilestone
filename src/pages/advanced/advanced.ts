import { Component, NgZone} from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ActionSheetController,ToastController, MenuController,Platform, Events } from 'ionic-angular';
import { ConnectionPage} from '../connection/connection';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AtCmdDispatcherService, BleDeviceInfo } from '../../providers/atcmd-dispatcher/atcmd-dispatcher.service';
import { ATCMDHDLQCCSNK } from '../../providers/atcmd-dispatcher/atcmd-handler-qcc-sink';
import { ThrowStmt } from '@angular/compiler';
import{model}from'../../app/model'
import { LrReceiverPage } from '../lr-receiver/lr-receiver';
import { DiscoverPage } from '../discover/discover';
/**
/**
* Generated class for the AdvancedPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
@IonicPage()
@Component({
selector: 'page-advanced',
templateUrl: 'advanced.html',
})
export class AdvancedPage {


private connectTimeoutToOptions;
private connectAttemptRepeat:any;
protected devInfo : BleDeviceInfo;
protected pdlRecs : ATCMDHDLQCCSNK.PdlRec[] = [];
protected deviceState : string = "IDLE";
protected streamState : string = "STOP";
public stopConnectAttemptValue;
public pairingButtonColor : string = "dark"
protected qccSnkHandler : ATCMDHDLQCCSNK.AtCmdHandler_QCC_SNK = null;
protected han:ATCMDHDLQCCSNK.AtCmdRec_DN=null;
private bindedFunctions : {};



constructor(public navCtrl: NavController,
public  nativePageTransitions: NativePageTransitions,
public menuCtrl:MenuController,
public navParams: NavParams,
public nav: Nav, 
public toastCtrl:ToastController,
public actionSheetCtrl: ActionSheetController,
private zone: NgZone,
public mod:model,
public dispatcher : AtCmdDispatcherService,
public events: Events, public platform: Platform,) 
{
this.connectTimeoutToOptions="Idle";
this.devInfo=mod.getdeviceinfo
var refreshPdl : boolean = this.navParams.get('refreshPdl');
this.connectAttemptRepeat=0;

if( this.getHandler() )
{
var state = this.qccSnkHandler.atCmdDS.deviceState
this.deviceState = this.qccSnkHandler.atCmdDS.deviceStateStrs[state];
this.pairingButtonColor = this.deviceState == 'DISCOVERABLE' ?"danger" :"dark";
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


ionViewWillEnter() {
console.log('ion will Enter')
var fn : any;
this.bindedFunctions = {};
fn = this.handleBleDevChanged.bind(this);
this.events.subscribe('BLE_DEV_CHANGED', fn);
this.bindedFunctions['BLE_DEV_CHANGED'] = fn;
fn = this.handleDeviceStateChanged.bind(this);
this.events.subscribe('QCC_SNK_DEVICE_STATE_CHANGED', fn);
this.bindedFunctions['QCC_SNK_DEVICE_STATE_CHANGED'] = fn;
this.menuCtrl.swipeEnable( false, 'menu2' );
this.getStopConnectAttempt();
this.qccSnkHandler.getConnectAttemptRepeat().then( ret => {
console.log("[DEVICE-SNK] get Connect Attempt Repeat to success " + JSON.stringify(ret));
var connectAttemptRepeatResult= JSON.stringify(ret);
this.connectAttemptRepeat =  connectAttemptRepeatResult.substr(1).slice(0, -1);
console.log("number", this.connectAttemptRepeat);
}).catch( ret => {
console.log("[DEVICE-SNK] get Connect Attempt Repeat to fail " + JSON.stringify(ret));
});
}


//Navigate To Connection Page
private moveToConnection(){
let options:NativeTransitionOptions={
direction:'right',
duration:500,
slowdownfactor:-1,
slidePixels:0
}
this.nativePageTransitions.slide(options);
this.navCtrl.pop( );
}
private connectTimeoutOptions(){
let actionSheet = this.actionSheetCtrl.create({
title: 'Connect Timeout To Options',
buttons: [
{
text: 'Pairing',
handler: () => {
console.log('Pairing clicked');
}
},
{
text: 'Connectable',
handler: () => {
}
},
{
text: 'Idle',
handler: () => {
console.log('Idle clicked');
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
if( this.qccSnkHandler == null )
{
console.log("[DEVICE-SNK] error page close");
// this.navCtrl.pop({animate: true, animation:'ios-transition', duration:500, direction:'back'});
//  this.navCtrl.popAll();
this.navCtrl.popToRoot({animate: true, animation:'ios-transition', duration:500, direction:'back'})
return false;
}    
return true;
}


private handleBleDevChanged(params)
{
//console.log('[DEVICE-SNK]', JSON.stringify(params));
if( params.name == 'QCC_SNK' && params.action == 'disconnect' )
{
console.log("[DEVICE-SNK] disconnect page close");
//this.navCtrl.pop({animate: true, animation:'ios-transition', duration:500, direction:'back'});
// this.navCtrl.popAll();
this.navCtrl.popToRoot({animate: true, animation:'ios-transition', duration:500, direction:'back'})
}
}
refreshPdl()
{
// Clear the list
this.zone.run( () => {
this.pdlRecs = [];
});
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



ionViewDidLeave()
{
for( var key in this.bindedFunctions )
{
var fn = this.bindedFunctions[key];
this.events.unsubscribe(key, fn);
}
this.bindedFunctions = null;
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


private connectPolicy(){
let actionSheet = this.actionSheetCtrl.create({
title: 'Connect Policy Options',
buttons: [
{
text: 'Connect To Last Device',
handler: () => {
this.setUpConnectPolicy("true");
console.log('Connect To Last Deviceclicked');
}
},
{
text: 'Connect To List',
handler: () => {
this.setUpConnectPolicy("false");
console.log('Connect To List clicked');
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


private setStopConnectAttempt($event, stopConnectAttempt){
console.log(stopConnectAttempt);
this.qccSnkHandler.setStopConnectAttempt(stopConnectAttempt).then( ret => {
if(stopConnectAttempt==true)
{
this.presentToast("Turned On");
this.stopConnectAttemptValue="true"
}
else
{
this.presentToast("Turned Off");
this.stopConnectAttemptValue="false"
}
console.log("[DEVICE-SNK] set Up Stop Connect Attempt success " + JSON.stringify(ret));
}).catch( ret => {
this.presentToast("Timeout Expired")
console.log("[DEVICE-SNK] set Up Stop Connect Attempt fail " + JSON.stringify(ret));
});
}


private  setUpConnectPolicy(options){

this.qccSnkHandler.setConnectPolicy(options).then( ret => {
this.presentToast("Success");
console.log("[DEVICE-SNK] set Up Connect Policy success " + JSON.stringify(ret));
}).catch( ret => {
this.presentToast("Timeout Expired");
console.log("[DEVICE-SNK] set Up Connect Policy fail " + JSON.stringify(ret));
});
}


private connectAttempt(){
let actionSheet = this.actionSheetCtrl.create({
title: 'Connect Timeout To Options',
buttons: [
{
text: 'Pairing',
handler: () => {
this.connectTimeoutToOptions="Pairing"
this.connectTimeoutTo(1);
console.log('Pairing');
}
},
{
text: 'Connectable',
handler: () => {
console.log('Connectable');
this.connectTimeoutTo(1);
this.connectTimeoutToOptions="Connectable"
}
},
{
text: 'Idle',
handler: () => {
this.connectTimeoutToOptions="Idle"
this.connectTimeoutTo(0);
console.log('Idle');
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


private attemptRepeat(connectAttemptRepeat){

if(connectAttemptRepeat<2 || connectAttemptRepeat>65535){
this.presentToast("The Range Should be 2 to 65535")
}
else{
this.qccSnkHandler.setConnectAttemptRepeat(connectAttemptRepeat).then( ret => {
this.presentToast("Success");
console.log("[DEVICE-SNK] Set Connect Attempt Repeat to success " + JSON.stringify(ret));
}).catch( ret => {
this.presentToast("Timeout Expired");
console.log("[DEVICE-SNK] Set Connect Attempt Repeat to fail " + JSON.stringify(ret));
});
}
}


private connectTimeoutTo(value){
this.qccSnkHandler.setPairingTimeoutTo(value).then( ret => {
this.presentToast("Success");
console.log("[DEVICE-SNK] set Connect Timeout to success " + JSON.stringify(ret));
}).catch( ret => {
this.presentToast("Timeout Expired");
console.log("[DEVICE-SNK] setConnect Timeout to fail " + JSON.stringify(ret));
});
}


private getStopConnectAttempt(){
this.qccSnkHandler.getStopConnectAttempt().then( ret => {
console.log("[DEVICE-SNK]get Stop Connect Attempt success " + JSON.stringify(ret));
if(JSON.stringify(ret)=="1" ||JSON.stringify(ret)=="true" ){
this.stopConnectAttemptValue="true"
}
else
this.stopConnectAttemptValue="false"
}).catch( ret => {
console.log("[DEVICE-SNK] get Stop Connect Attempt fail " + JSON.stringify(ret));
});
}


private getConnectTimeoutTO(){
this.qccSnkHandler.getStopConnectAttempt().then( ret => {
console.log("[DEVICE-SNK] set Up Stop Connect Attempt success " + JSON.stringify(ret));
if(JSON.stringify(ret)=="1" ||JSON.stringify(ret)=="true" ){
this.stopConnectAttemptValue="true"
}
else
this.stopConnectAttemptValue="false"
}).catch( ret => {
console.log("[DEVICE-SNK] set Up Stop Connect Attempt fail " + JSON.stringify(ret));
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

}//end
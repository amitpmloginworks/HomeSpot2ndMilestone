import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav,MenuController,ToastController, Platform, Events } from 'ionic-angular';
import { ConnectionPage } from '../connection/connection';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import{ATCMDHDLQCCSNK}from'../../providers/atcmd-dispatcher/atcmd-handler-qcc-sink'
import { AtCmdDispatcherService, BleDeviceInfo } from '../../providers/atcmd-dispatcher/atcmd-dispatcher.service';
import{model}from'../../app/model'
import { DiscoverPage } from '../discover/discover';
/**
* Generated class for the TimeoutsPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
@IonicPage()
@Component({
selector: 'page-timeouts',
templateUrl: 'timeouts.html',
})
export class TimeoutsPage {

protected devInfo : BleDeviceInfo;
protected pdlRecs : ATCMDHDLQCCSNK.PdlRec[] = [];
protected deviceState : string = "IDLE";
protected streamState : string = "STOP";
public showValue;
public showKeyboard;
public email;
public value;
public connectTime;
public pairingTime;
public linkLoss;
protected qccSnkHandler : ATCMDHDLQCCSNK.AtCmdHandler_QCC_SNK = null;
private bindedFunctions : {};

constructor(public navCtrl: NavController, public dispatcher : AtCmdDispatcherService,
public platform: Platform,
public model:model,
private zone: NgZone,
public events: Events, public toastCtrl:ToastController, private nativePageTransitions: NativePageTransitions, public navParams: NavParams, public nav: Nav, public menuCtrl:MenuController) {
if(localStorage['linkLoss'] !=undefined)
{
this.linkLoss=localStorage['linkLoss']
}
if(localStorage['connectTime'] !=undefined)
{
this.connectTime=localStorage['connectTime']
}
if(localStorage['pairingTime'] !=undefined)
{
this.pairingTime=localStorage['pairingTime']
}
this.showValue="true"
this.showKeyboard="false"
this.devInfo=model.getdeviceinfo
var refreshPdl : boolean = this.navParams.get('refreshPdl');
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
this.qccSnkHandler.getPairingTimeoutTo().then( ret => {
console.log("get Pairing Timeout success " + JSON.stringify(ret));
}).catch( ret => {
console.log("get Pairing Timeout fail " + JSON.stringify(ret));
});
}

moveToConnection(){
let options:NativeTransitionOptions={
direction:'right',
duration:500,
slowdownfactor:-1,
slidePixels:0
}
this.nativePageTransitions.slide(options);
this.nav.pop();
}


private handleBleDevChanged(params)
{
//console.log('[DEVICE-SNK]', JSON.stringify(params));
if( params.name == 'QCC_SNK' && params.action == 'disconnect' )
{
console.log("[DEVICE-SNK] disconnect page close");
this.navCtrl.popToRoot({animate: true, animation:'ios-transition', duration:500, direction:'back'})
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
// Handler is not any more
// - likely the device is disconnected
// - pop this page and let the parent to handle it
console.log("[DEVICE-SNK] error page close");
// this.navCtrl.pop( {animate: true, animation:'ios-transition', duration:500, direction:'back'});
//this.navCtrl.popAll();
this.navCtrl.popToRoot({animate: true, animation:'ios-transition', duration:500, direction:'back'})
return false;
}    
return true;
}


refreshPdl()
{
// Clear the list
this.zone.run( () => {
this.pdlRecs = [];
console.log("pdlrecs",this.pdlRecs);
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



private setTimeout(){
this.qccSnkHandler.setPairingTimeoutTo(10).then( ret => {
console.log("Set Timeout success " + JSON.stringify(ret));
}).catch( ret => {
console.log("Set Timeout fail " + JSON.stringify(ret));
});
}
openOrCloseKeyboard(showKeyboard, showValue){
console.log(showKeyboard, showValue);
if(showKeyboard){
console.log("if");
this.showKeyboard="false"
this.showValue="true"
}
else{
this.showKeyboard="true"
this.showValue="false"
}
}





private connectableTimeout(connectTime){
console.log('connectTime')
if(connectTime>65535){
this.presentToast("The Range Should Not Exceed 65535")
}
else {
this.qccSnkHandler.setPairingTimeoutTo(connectTime).then( ret => {
this.presentToast("Success");
localStorage['connectTime'] =connectTime
console.log("Set Timeout success " + JSON.stringify(ret));
}).catch( ret => {
this.presentToast("Timeout Expired");
console.log("Set Timeout fail " + JSON.stringify(ret));
});
}
}


private linkLossTimeout(linkLoss){
if(linkLoss>65535){
this.presentToast("The Range Should Not Exceed 65535")
}
else {
this.qccSnkHandler.setPairingTimeoutTo(linkLoss).then( ret => {
this.presentToast("Success");
localStorage['linkLoss'] =linkLoss
console.log("Set Link Loss Timeout success " + JSON.stringify(ret));
}).catch( ret => {
this.presentToast("Timeout Expired");
console.log("Set Link Loss Timeout fail " + JSON.stringify(ret));
});
}
}


private pairingTimeout(pairingTime){
if(pairingTime>65535){
this.presentToast("The Range Should Not Exceed 65535")
}
else {
this.qccSnkHandler.setPairingTimeoutTo(pairingTime).then( ret => {
this.presentToast("Success");
localStorage['pairingTime'] =pairingTime;
console.log("Set PairingTimeout success " + JSON.stringify(ret));
}).catch( ret => {
this.presentToast("Timeout Expired");
console.log("Set Pairing Timeout fail " + JSON.stringify(ret));
});
}
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
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,ToastController, Platform, Events } from 'ionic-angular';
import {CustomizationPage } from '../customization/customization';
import { AdvancedPage} from '../advanced/advanced';
import { TimeoutsPage} from '../timeouts/timeouts'; 
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AtCmdDispatcherService, BleDeviceInfo } from '../../providers/atcmd-dispatcher/atcmd-dispatcher.service';
import { ATCMDHDLQCCSNK } from '../../providers/atcmd-dispatcher/atcmd-handler-qcc-sink';
import { ThrowStmt } from '@angular/compiler';
import{model}from'../../app/model'
import { DiscoverPage } from '../discover/discover';
/**
* Generated class for the ConnectionPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
@IonicPage()
@Component({
selector: 'page-connection',
templateUrl: 'connection.html',
})

export class ConnectionPage {

private slideOptions;
private powerOnPairing;
private PowerOnConnect;
public pwrOnConnect : boolean = true;
public pwrOnPairing : boolean = true;
public remainOnPairing : boolean = true;
public powerOnPairingValue;
public powerOnConnectValue;
public remainInPairngValue
protected devInfo : BleDeviceInfo;
protected pdlRecs : ATCMDHDLQCCSNK.PdlRec[] = [];
protected deviceState : string = "IDLE";
protected streamState : string = "STOP";
public pairingButtonColor : string = "dark"
protected qccSnkHandler : ATCMDHDLQCCSNK.AtCmdHandler_QCC_SNK = null;
protected han:ATCMDHDLQCCSNK.AtCmdRec_DN=null;
private bindedFunctions : {};

constructor(public menuCtrl:MenuController,  
private zone: NgZone,
public toastCtrl:ToastController,
public dispatcher : AtCmdDispatcherService,
public mod:model,
public events: Events, public platform: Platform, public navCtrl: NavController, public navParams: NavParams, public  nativePageTransitions: NativePageTransitions ) {
this.devInfo=mod.getdeviceinfo
var refreshPdl : boolean = this.navParams.get('refreshPdl');
if( localStorage["PowerOnConnect"]!=undefined)
{
this.powerOnConnectValue= localStorage["PowerOnConnect"]
console.log("power on connect....",this.powerOnConnectValue);
}
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
// // Register for android's system back button
// let backAction =  platform.registerBackButtonAction(() => {
//   console.log("[DEVICE-SNK] user page close");
//   this.navCtrl.pop({animate: true, animation:'ios-transition', duration:500, direction:'back'});
//   backAction();
// },2)
}



ionViewWillEnter() {
console.log('ion will Enter')
//closing right side menu
this.menuCtrl.swipeEnable( false, 'menu2' );
// this.getPowerOnConnect();
this.getPowerOnPairing();
this.getReaminOnPairing();
var fn : any;
this.bindedFunctions = {};

fn = this.handleBleDevChanged.bind(this);
this.events.subscribe('BLE_DEV_CHANGED', fn);
this.bindedFunctions['BLE_DEV_CHANGED'] = fn;

fn = this.handleDeviceStateChanged.bind(this);
this.events.subscribe('QCC_SNK_DEVICE_STATE_CHANGED', fn);
this.bindedFunctions['QCC_SNK_DEVICE_STATE_CHANGED'] = fn;
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
this.navCtrl.popToRoot({animate: true, animation:'ios-transition', duration:500, direction:'back'})
return false;
}    
return true;
}


//Navigate to Customization
private moveToCustomization(){
let options:NativeTransitionOptions={
direction:'right',
duration:500,
slowdownfactor:-1,
slidePixels:0
}
this.nativePageTransitions.slide(options);
this.navCtrl.pop();
}


refreshPdl()
{
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


// Navigate to Advanced
private moveToAdvanced(){
this.nativePageTransitions.slide(this.slideOptions)
this.navCtrl.push(AdvancedPage , {'devInfo' :this.devInfo});
}



//Navigate To Timeouts
private moveToTimeouts(){
this.nativePageTransitions.slide(this.slideOptions)
this.navCtrl.push(TimeoutsPage);
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
if( params.name == 'QCC_SNK' && params.action == 'disconnect' )
{
console.log("[DEVICE-SNK] disconnect page close");
// this.navCtrl.pop({animate: true, animation:'ios-transition', duration:500, direction:'back'});
// this.navCtrl.popAll();
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
this.qccSnkHandler.refreshPdl();        
}


private setPowerOnPairing($event, powerOnPairing ){
this.qccSnkHandler.setPowerOnPairing(powerOnPairing).then( ret => {
if(powerOnPairing==true)
{
this.presentToast("Turned On");
this.powerOnPairingValue="true"
}
else
{
this.presentToast("Turned Off");
this.powerOnPairingValue="false"
}
console.log("[DEVICE-SNK] Set Power On Pairing Success " + JSON.stringify(ret));
}).catch( ret => {
this.presentToast("Timeout Expired")
console.log("[DEVICE-SNK] Set Power On Pairing Fail " + JSON.stringify(ret));
});
}


private setPowerOnConnect($event, powerOnConnect){
this.qccSnkHandler.setPowerOnConnect(powerOnConnect).then( ret => {
if(powerOnConnect==true)
{
this.presentToast("Turned On");
this.powerOnConnectValue="true"
localStorage["PowerOnConnect"]= this.powerOnConnectValue
}
else
{
this.presentToast("Turned Off");
this.powerOnConnectValue="false"
localStorage["PowerOnConnect"]= this.powerOnConnectValue
}   
console.log("[DEVICE-SNK] Set Power On Connect Success " + JSON.stringify(ret));
}).catch( ret => {
this.presentToast("Timeout Expired")
console.log("[DEVICE-SNK] Set Power On Connect Fail " + JSON.stringify(ret));
});
}


private setRemainOnPairing($event, remainInPairng){
console.log('value', remainInPairng);
this.qccSnkHandler.setRemainOnPairing(remainInPairng).then( ret => {
if(remainInPairng==true)
{
this.presentToast("Turned On");
this.remainInPairngValue="true"
}
else
{
this.presentToast("Turned Off");
this.remainInPairngValue="false"
}
console.log("[DEVICE-SNK] Set Remain On Pairing Success " + JSON.stringify(ret));
}).catch( ret => {
this.presentToast("Timeout Expired")
console.log("[DEVICE-SNK] Set Remain On Pairing Fail " + JSON.stringify(ret));
});
}


private getPowerOnPairing(){
var power= this.qccSnkHandler.getPowerOnPairing().then( ret => {
console.log("[DEVICE-SNK] Get Power On Pairing Success " + JSON.stringify(ret));
this.zone.run(() => {
this.powerOnPairingValue = ret;
});
}).catch( ret => {
console.log("[DEVICE-SNK] Get Power On Pairing Fail " + JSON.stringify(ret));
});
}


private getPowerOnConnect(){
this.qccSnkHandler.getPowerOnConnect().then( ret => {
this.zone.run(() => {
this.powerOnConnectValue = ret;
});
console.log("[DEVICE-SNK] Get power on connect  Success " + JSON.stringify(ret));
if(JSON.stringify(ret)=="1" ||JSON.stringify(ret)=="true" ){
this.powerOnConnectValue="true"
}
else{}
this.powerOnConnectValue="false"
}).catch( ret => {
console.log("[DEVICE-SNK] Get power on connect Fail " + JSON.stringify(ret));
});
}


private getReaminOnPairing(){
this.qccSnkHandler.getRemainOnPairing().then( ret => {
this.zone.run(() => {
this.remainInPairngValue = ret;
});
console.log("[DEVICE-SNK] Set Remain On Pairing Success " + JSON.stringify(ret));
}).catch( ret => {
console.log("[DEVICE-SNK] Set Remain On Pairing Fail " + JSON.stringify(ret));
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
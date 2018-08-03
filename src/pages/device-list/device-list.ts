import { Component, NgZone } from '@angular/core';
import { IonicPage,  Platform, Events,NavController, NavParams, ViewController, ActionSheetController,AlertController, MenuController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AtCmdDispatcherService, BleDeviceInfo } from '../../providers/atcmd-dispatcher/atcmd-dispatcher.service';
import { ATCMDHDLQCCSNK } from '../../providers/atcmd-dispatcher/atcmd-handler-qcc-sink';
import{model}from'../../app/model'
/**
* Generated class for the DeviceListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
@IonicPage()
@Component({
selector: 'page-device-list',
templateUrl: 'device-list.html',
})
export class DeviceListPage {


protected devInfo : BleDeviceInfo;
protected pdlRecs : ATCMDHDLQCCSNK.PdlRec[] = [];
protected deviceState : string = "IDLE";
protected streamState : string = "STOP";
public pairingButtonColor : string = "button"
public bluetoothName;
public deviceName;
protected qccSnkHandler : ATCMDHDLQCCSNK.AtCmdHandler_QCC_SNK = null;
private bindedFunctions : {};

constructor(public menuCtrl:MenuController,public dispatcher : AtCmdDispatcherService,public mod:model,
public events: Events,public platform: Platform, private zone: NgZone, private nativePageTransitions: NativePageTransitions, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public viewCtrl:ViewController,public actionSheetCtrl: ActionSheetController) {
this.devInfo=mod.getdeviceinfo;
console.log("devinfo1", this.devInfo);
var refreshPdl='true';
if( this.getHandler() )
{
var state = this.qccSnkHandler.atCmdDS.deviceState
this.deviceState = this.qccSnkHandler.atCmdDS.deviceStateStrs[state];
this.pairingButtonColor = this.deviceState == 'DISCOVERABLE' ?"danger" :"button";
if( refreshPdl )
{
console.log("if refresh", refreshPdl)
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
console.log('ionViewDidLoad DeviceListPage');
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
fn = this.handlePdlChanged.bind(this);
this.events.subscribe('QCC_SNK_PDL_CHANGED', fn);
this.bindedFunctions['QCC_SNK_PDL_CHANGED'] = fn;
fn = this.handleDeviceStateChanged.bind(this);
this.events.subscribe('QCC_SNK_DEVICE_STATE_CHANGED', fn);
this.bindedFunctions['QCC_SNK_DEVICE_STATE_CHANGED'] = fn;
fn = this.handleStreamStateChanged.bind(this);
this.events.subscribe('QCC_SNK_STREAM_STATE_CHANGED', fn);
this.bindedFunctions['QCC_SNK_STREAM_STATE_CHANGED'] = fn;
this.refreshpdl()
this.qccSnkHandler.getLocalBluetoothName().then( ret => {
console.log("[DEVICE-SNK] Get Local Bluetooth Name Success " + JSON.stringify(ret));
this.bluetoothName=JSON.stringify(ret)
}).catch( ret => {
console.log("[DEVICE-SNK] Get Local Bluetooth Name Fail " + JSON.stringify(ret));
});;
}


private goBack(){
//this.navCtrl.pop();
let options: NativeTransitionOptions = {
direction: 'down',
duration: 400,
slowdownfactor: -1,
slidePixels: 0,
iosdelay: 100,
androiddelay: 250,
fixedPixelsTop: 0,
fixedPixelsBottom: 0
}; 
this.menuCtrl.swipeEnable( true, 'menu2' );
this.nativePageTransitions.slide(options)
this.viewCtrl.dismiss({'devInfo' :this.devInfo});
}


private selectOptions(item, pdlRec){
let actionSheet = this.actionSheetCtrl.create({
title: 'Active Device Actions',
buttons: [
{
text: 'Disconnect',
handler: () => {
this.disconnectPdl(item, pdlRec)
console.log('Disconnect clicked');
}
},
{
text: 'Connect',
handler: () => {
this.connectPdl(item,pdlRec )
console.log('Connect clicked');
}
},
{
text: 'Rename',
handler: () => {
console.log('Rename clicked');
}
},
{
text: 'Remove',
role:'destructive',
handler: () => {
this.removePdl(item, pdlRec)
console.log('Remove clicked');
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

// Pair with new Device
private pairNew(){
let alert = this.alertCtrl.create({
title: 'Pairing Mode On',
subTitle: "The receiver's pairing mode is now turned on. Go the source device's Bluetooth Settings, then pair and connect to this receiver named"+ this.bluetoothName ,
buttons: [ 
{
text: 'OK',
handler: () => {
this.choose();
console.log('Cancel clicked');
}
},
]});
alert.present();
}
private choose(){
let alert = this.alertCtrl.create({
title: 'Connection Alert',
subTitle: "A new device "+ this.deviceName +" is paired and connected. Do you want to give me a name to this Device?",
buttons: [ 
{
text: 'Yes',
handler: () => {
this.giveName();
console.log('Yes clicked');
}
},
{
text: 'No',
handler: () => {
console.log('No clicked');
}
},
]});
alert.present();
}


private giveName(){
let alert = this.alertCtrl.create({
title: 'Device Name',
subTitle:"Enter a new name for [00-01-02-03-04-05]",
inputs: [
{
name: 'username',
placeholder: "Kyle's iphone"
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
this.qccSnkHandler.setLocalBluetoothName(data.username).then( ret => {
console.log("[DEVICE-SNK] set Local Bluetooth Name success " + JSON.stringify(ret));
}).catch( ret => {
console.log("[DEVICE-SNK] set Local Bluetooth Name fail " + JSON.stringify(ret));
});
}
}
]
});
alert.present();
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


private handleBleDevChanged(params)
{
//console.log('[DEVICE-SNK]', JSON.stringify(params));
if( params.name == 'QCC_SNK' && params.action == 'disconnect' )
{
console.log("[DEVICE-SNK] disconnect page close");
this.navCtrl.popToRoot({animate: true, animation:'ios-transition', duration:500, direction:'back'});
}
}


private handlePdlChanged(params)
{
console.log('[DEVICE-SNK] PDL changed: ' + JSON.stringify(params));
this.zone.run(() => {
this.pdlRecs = params.pdl;
for(var i=0; i<this.pdlRecs.length; i++)
{
if(this.pdlRecs[i].isMusicConnected==1)
{
this.deviceName=this.pdlRecs[i].remoteDevName
console.log("dev name",this.deviceName)
}
}
});
}


private handleDeviceStateChanged(params)
{
console.log('[DEVICE-SNK] device state changed: ' + JSON.stringify(params));
this.zone.run( () => {
this.deviceState = params.state;
this.pairingButtonColor = this.deviceState == 'DISCOVERABLE' ?"danger" :"button";
});
// Update PDL since device state has changed
this.qccSnkHandler.refreshPdl();        
}


private handleStreamStateChanged(params)
{
console.log('[DEVICE-SNK] stream state changed: ' + JSON.stringify(params));
this.zone.run( () => {
if( params.action == 'connect' )
{
this.streamState = params.codec;
}
else
{
this.streamState = 'STOP';
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
if( this.qccSnkHandler == null )
{
// Handler is not any more
// - likely the device is disconnected
// - pop this page and let th parent to handle it
console.log("[DEVICE-SNK] error page close");
this.navCtrl.popToRoot({animate: true, animation:'ios-transition', duration:500, direction:'back'});
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
//this.pdlRecs = ret.pdl;
}).catch( ret => {
console.log("[DEVICE-SNK] refresh PDL fail " + JSON.stringify(ret));
});
}



private pairingButtonPressed(event)
{
console.log("[DEVICE-SNK] change pairing [" + this.devInfo.uuid + "][" + this.devInfo.name + "]");
if(!this.getHandler() )
{
return;
}
var onOff = true;
if( this.pairingButtonColor != 'button' )
{
onOff = false;
}
this.qccSnkHandler .setPairingOnOff(onOff).then( ret => {
console.log("[DEVICE-SNK] change pairing success " + JSON.stringify(ret));
this.pairNew();
this.zone.run( () => {
if( this.pairingButtonColor == 'button' )
{
this.pairingButtonColor = 'danger';
}
else
{
this.pairingButtonColor = 'button';
}
});
}).catch( ret => {
console.log("[DEVICE-SNK] change pairing fail " + JSON.stringify(ret));
});;
}

private connectPdl(item, pdlRec)
{
//  item.close();
if( !this.getHandler() )
{
return;
}
if( pdlRec.isMusicConnected )
{

return;
}
// Create a "conneting" prompt
let connectingPrompt = this.alertCtrl.create({
title: 'Connecting'
});
connectingPrompt.present();
console.log("[DEVICE-SNK] Connenting PDL [" + pdlRec.addr + "]");
this.qccSnkHandler.connectDevice(pdlRec.addr).then( ret => {
console.log("[DEVICE-SNK] connect PDL success " + JSON.stringify(ret));
connectingPrompt.dismiss();
}).catch( ret => {
console.log("[DEVICE-SNK] connect PDL fail " + JSON.stringify(ret));
connectingPrompt.dismiss();
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

private disconnectPdl(item, pdlRec)
{
//item.close();
if( !this.getHandler() )
{
return;
}
if( !pdlRec.isMusicConnected )
{
return;
}
// Create a "disconneting" prompt
let disconnectingPrompt = this.alertCtrl.create({
title: 'Disconnecting'
});
disconnectingPrompt.present();
console.log("[DEVICE-SNK] Disconnecting device in PDL [" + pdlRec.addr + "]");
this.qccSnkHandler.disconnectDevice(pdlRec.addr).then( ret => {
console.log("[DEVICE-SNK] disconnect device in PDL success " + JSON.stringify(ret));
disconnectingPrompt.dismiss();
}).catch( ret => {
disconnectingPrompt.dismiss();
console.log("[DEVICE-SNK] disconnect device in PDL fail " + JSON.stringify(ret));
let prompt = this.alertCtrl.create({
title: 'Disconnect failed [' + ret.status + ']',
buttons: [
{
text: 'Ok'
}
]
});
prompt.present();
});     
}


private removePdl(item, pdlRec)
{
// item.close();
if( !this.getHandler() )
{
return;
}
// Create a "Removing" prompt
let removingPrompt = this.alertCtrl.create({
title: 'Removing'
});
removingPrompt.present();
console.log("[DEVICE-SNK] Removing device in PDL [" + pdlRec.addr + "]");
this.qccSnkHandler.removePDL(pdlRec.addr).then( ret => {
console.log("[DEVICE-SNK] remove device in PDL success " + JSON.stringify(ret));
removingPrompt.dismiss();
this.qccSnkHandler.refreshPdl();
}).catch( ret => {
removingPrompt.dismiss();
console.log("[DEVICE-SNK] remove device in PDL fail " + JSON.stringify(ret));
let prompt = this.alertCtrl.create({
title: 'Remove failed [' + ret.status + ']',
buttons: [
{
text: 'Ok'
}
]
});
prompt.present();
});
}


refreshpdl(){
this.qccSnkHandler.refreshPdl().then( ret => {
console.log("[DEVICE-SNK] Refresh PDL>>>>> success " + JSON.stringify(ret));
}).catch( ret => {
console.log("[DEVICE-SNK] Refresh PDL>>>> fail " + JSON.stringify(ret));
});
}

}//end
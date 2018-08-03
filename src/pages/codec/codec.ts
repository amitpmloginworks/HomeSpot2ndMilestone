import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, MenuController,ToastController, Platform, Events} from 'ionic-angular';
import { CustomizationPage} from '../customization/customization';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import{ATCMDHDLQCCSNK}from'../../providers/atcmd-dispatcher/atcmd-handler-qcc-sink'
import { AtCmdDispatcherService, BleDeviceInfo } from '../../providers/atcmd-dispatcher/atcmd-dispatcher.service';
import{model}from'../../app/model'
import { LrReceiverPage } from '../lr-receiver/lr-receiver';
import { DiscoverPage } from '../discover/discover';
/**
* Generated class for the CodecPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
@IonicPage()
@Component({
selector: 'page-codec',
templateUrl: 'codec.html',
})


export class CodecPage {


protected devInfo : BleDeviceInfo;
protected pdlRecs : ATCMDHDLQCCSNK.PdlRec[] = [];
protected deviceState : string = "IDLE";
protected streamState : string = "STOP";
public setAptXAttemptvalue : boolean = false;
public setAptXLLAttemptvalue : boolean = false;
public  setAptXHDAttemptvalue : boolean = false;
public  setAACAttemptvalue: boolean = false;
public codecAptX : boolean = false;
public codecAptXLL : boolean = false;
public codecAptXHD : boolean = false;
public codecAac : boolean = false;
public pairingButtonColor : string = "dark"
protected qccSnkHandler : ATCMDHDLQCCSNK.AtCmdHandler_QCC_SNK = null;
private bindedFunctions : {};

constructor(public navCtrl: NavController, 
private zone: NgZone,
public dispatcher : AtCmdDispatcherService,
public platform: Platform,
public model:model,
public toastCtrl:ToastController,
public events: Events, public  nativePageTransitions: NativePageTransitions, public navParams: NavParams, public nav: Nav, public menuCtrl:MenuController) {
this.devInfo=this.model.getdeviceinfo
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
this.menuCtrl.swipeEnable( false, 'menu2' );
var fn : any;
this.bindedFunctions = {};
fn = this.handleBleDevChanged.bind(this);
this.events.subscribe('BLE_DEV_CHANGED', fn);
this.bindedFunctions['BLE_DEV_CHANGED'] = fn;
fn = this.handleDeviceStateChanged.bind(this);
this.events.subscribe('QCC_SNK_DEVICE_STATE_CHANGED', fn);
this.bindedFunctions['QCC_SNK_DEVICE_STATE_CHANGED'] = fn;
// get Codec Values
this.qccSnkHandler.getCodecMask().then((mask) => {
this.zone.run(() => {
this.codecAptX = ( mask & 0x1 ) ?true :false;
this.codecAptXLL = ( mask & 0x2 ) ?true :false;
this.codecAptXHD = ( mask & 0x4 ) ?true :false;
this.codecAac = ( mask & 0x8 ) ?true :false;
});
});
}



private handleBleDevChanged(params)
{
//console.log('[DEVICE-SNK]', JSON.stringify(params));
if( params.name == 'QCC_SNK' && params.action == 'disconnect' )
{
console.log("[DEVICE-SNK] disconnect page close");
//   this.navCtrl.pop({animate: true, animation:'ios-transition', duration:500, direction:'back'});
this.navCtrl.popToRoot({animate: true, animation:'ios-transition', duration:500, direction:'back'})
}
}

//Navige To Customization
moveTocustomization(){
let options:NativeTransitionOptions={
direction:'right',
duration:500,
slowdownfactor:-1,
slidePixels:0
}
this.nativePageTransitions.slide(options);
this.navCtrl.pop();
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
// - pop this page and let th parent to handle it
console.log("[DEVICE-SNK] error page close");
//this.navCtrl.pop( {animate: true, animation:'ios-transition', duration:500, direction:'back'});
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


private updateCodec(value)
{
if(value==1)
{
if(this.codecAac)
{
this.presentToast("Turned Off")
}
else{
this.presentToast("Turned On")
}
}
else if(value==2)
{
if(this.codecAptX)
{
this.presentToast("Turned Off")
}
else{
this.presentToast("Turned On")
}
}
else if(value==3)
{
if(this.codecAptXLL)
{
this.presentToast("Turned Off")
}
else{
this.presentToast("Turned On")
}
}
else if(value==4)
{
if(this.codecAptXHD)
{
this.presentToast("Turned Off")
}
else{
this.presentToast("Turned On")
}
}
let mask = 0;
mask |= this.codecAptX ?(1 << 0) :0;
mask |= this.codecAptXLL ?(1 << 1) :0;
mask |= this.codecAptXHD ?(1 << 2) :0;
mask |= this.codecAac ?(1 << 3) :0;
this.qccSnkHandler.setCodecMask(mask).then( ret => {
console.log("[DEVICE-SNK] update Code success " + JSON.stringify(ret));
}).catch( ret => {
console.log("[DEVICE-SNK] update Codec fail " + JSON.stringify(ret));
});
}
}
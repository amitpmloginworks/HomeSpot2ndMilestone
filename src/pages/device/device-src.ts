import { Component, NgZone } from '@angular/core';
import { Platform, Events, IonicPage } from 'ionic-angular';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AtCmdDispatcherService, BleDeviceInfo } from '../../providers/atcmd-dispatcher/atcmd-dispatcher.service';
import { ATCMDHDLQCCSRC } from '../../providers/atcmd-dispatcher/atcmd-handler-qcc-src';

@IonicPage()

@Component({
  selector: 'page-device',
  templateUrl: 'device.html'
})
export class DeviceSrcPage 
{
  protected devInfo : BleDeviceInfo;
  protected pdlRecs : ATCMDHDLQCCSRC.PdlRec[] = [];
  protected deviceState : string = "IDLE";
  protected streamState : string = "STOP";

  public pairingButtonColor : string = "dark"

  protected qccSrcHandler : ATCMDHDLQCCSRC.AtCmdHandler_QCC_SRC = null;

  private bindedFunctions : {};

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private zone: NgZone,
    public alertCtrl : AlertController,
    public dispatcher : AtCmdDispatcherService,
    public events: Events
  ) {
      this.devInfo = this.navParams.get('devInfo');

      if( this.getHandler() )
      {
        var state = this.qccSrcHandler.atCmdDS.deviceState
        this.deviceState = this.qccSrcHandler.atCmdDS.deviceStateStrs[state];
        this.pairingButtonColor = this.deviceState == 'INQUIRING' ?"danger" :"dark";
      }

      // Register for android's system back button
      let backAction =  platform.registerBackButtonAction(() => {
        console.log("[DEVICE-SRC] user page close");
        this.navCtrl.pop({animate: true, animation:'ios-transition', duration:500, direction:'back'});
        backAction();
      },2)
  }

  ionViewWillEnter()
  {
    var fn : any;

    this.bindedFunctions = {};

    fn = this.handleBleDevChanged.bind(this);
    this.events.subscribe('BLE_DEV_CHANGED', fn);
    this.bindedFunctions['BLE_DEV_CHANGED'] = fn;

    fn = this.handlePdlChanged.bind(this);
    this.events.subscribe('QCC_SRC_PDL_CHANGED', fn);
    this.bindedFunctions['QCC_SRC_PDL_CHANGED'] = fn;

    fn = this.handleDeviceStateChanged.bind(this);
    this.events.subscribe('QCC_SRC_DEVICE_STATE_CHANGED', fn);
    this.bindedFunctions['QCC_SRC_DEVICE_STATE_CHANGED'] = fn;

    fn = this.handleStreamStateChanged.bind(this);
    this.events.subscribe('QCC_SRC_STREAM_STATE_CHANGED', fn);
    this.bindedFunctions['QCC_SRC_STREAM_STATE_CHANGED'] = fn;
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
    //console.log('[DEVICE-SRC]' + JSON.stringify(params));
    if( params.name == 'QCC_SRC' && params.action == 'disconnect' )
    {
      console.log("[DEVICE-SRC] disconnect page close");
      this.navCtrl.pop({animate: true, animation:'ios-transition', duration:500, direction:'back'});
    }
  }

  private handlePdlChanged(params)
  {
    console.log('[DEVICE-SRC]' + JSON.stringify(params));

    // {
    //   "pdl" : 
    //     [
    //       {
    //         "idx" : 0,
    //         "addr" : "00:02:5B:00:A5:A5",
    //         "addrType" : 0,
    //         "isPhoneProvisioned" : false,
    //         "isMusicProvisioned" : true,
    //         "isPhoneConnected" : 0,
    //         "isMusicConnected" : 0,
    //         "provisionProfile" : 2,
    //         "connectedProfile" : 0,
    //         "remoteDevName":null
    //       },
    //       {
    //         "idx" : 1,
    //         "addr" : "D4:A3:3D:B2:4F:23",
    //         "addrType" : 0,
    //         "isPhoneProvisioned" : false,
    //         "isMusicProvisioned" : true,
    //         "isPhoneConnected" : 0,
    //         "isMusicConnected" : 0,
    //         "provisionProfile" : 2,
    //         "connectedProfile" : 0,
    //         "remoteDevName" : null
    //       }
    //     ],
    //   "seqid" : 12,
    //   "uuid" : "0490D0BC-BA9C-9002-AFF8-AC0D053FC4B2",
    //   "cmdRsp" : "+PDL:",
    //   "retCode" : 0
    // }

    this.zone.run(() => {
      this.pdlRecs = params.pdl;
    });
  }

  private handleDeviceStateChanged(params)
  {
    console.log('[DEVICE-SRC]' + JSON.stringify(params));
    

    this.zone.run( () => {
      this.deviceState = params.state;
      this.pairingButtonColor = this.deviceState == 'INQUIRING' ?"danger" :"dark";
      // var ary = this.qccSrcHandler.getPdlImmediate();
      // if( ary == null )
      // {
      //   this.pdlRecs = [];
      // }
      // else
      // {
      //   this.pdlRecs = ary;
      // }
    });

    // Update PDL since device state has changed
    this.qccSrcHandler.refreshPdl();    
  }

  private handleStreamStateChanged(params)
  {
    console.log('[DEVICE-SRC]' + JSON.stringify(params));

    this.zone.run( () => {
      if( params.connCount > 0 )
      {
        this.streamState = params.codec + (params.connCount == 2 ?" [Dual]" :"");
      }
      else
      {
        this.streamState = 'STOP';
      }
    });

    // Update PDL since device state has changed
    this.qccSrcHandler.refreshPdl();    
  }

  private getHandler() : boolean
  {
    if( this.qccSrcHandler == null )
    {
      // this.qccSrcHandler = <ATCMDHDLQCCSRC.AtCmdHandler_QCC_SRC>this.dispatcher.getCmdChHandler(linkedList[foundIdx].uuid);
      this.qccSrcHandler = <ATCMDHDLQCCSRC.AtCmdHandler_QCC_SRC>this.dispatcher.getCmdChHandler(this.devInfo.uuid);
    }
    else
    {
      return true;
    }

    if( this.qccSrcHandler == null )
    {
      // Handler is not any more
      // - likely the device is disconnected
      // - pop this page and let th parent to handle it
      console.log("[DEVICE-SRC] error page close");
      this.navCtrl.pop({animate: true, animation:'ios-transition', duration:500, direction:'back'});
      return false;
    }    

    return true;
  }

  refreshPdl()
  {
    // var linkedList : BleDeviceInfo[] = this.dispatcher.getLinkedDevices();
    // var foundIdx = -1;

    // // Find the 1st connected device
    // for( var i = 0 ; i < linkedList.length; i++ )
    // {
    //   var devInfo = linkedList[i];
    //   if( devInfo.isConnected() )
    //   {
    //     foundIdx = i;
    //     break;
    //   }
    // }

    // if( foundIdx < 0 )
    // {
    //   let prompt = this.alertCtrl.create({
    //     title: 'Connect to a device first',
    //     buttons: [
    //         {
    //             text: 'Ok'
    //         }
    //     ]
    //   });
    //   prompt.present();
    //   return;
    // }

    // Clear the list
    this.pdlRecs = [];

    //console.log("[DEVICE-SRC] refresh PDL [" + linkedList[foundIdx].uuid + "][" + linkedList[foundIdx].name + "]");
    console.log("[DEVICE-SRC] refresh PDL [" + this.devInfo.uuid + "][" + this.devInfo.name + "]");

    if( !this.getHandler() )
    {
      return;
    }

    this.qccSrcHandler.refreshPdl().then( ret => {
      console.log("[DEVICE-SRC] refreshing PDL success " + JSON.stringify(ret));
      //this.pdlRecs = ret.pdl;
    }).catch( ret => {
      console.log("[DEVICE-SRC] refreshing PDL fail " + JSON.stringify(ret));
    });
}

  pairingButtonPressed(event)
  {
    console.log("[DEVICE-SRC] change pairing [" + this.devInfo.uuid + "][" + this.devInfo.name + "]");

    if( !this.getHandler() )
    {
      return;
    }
    
    var onOff = true;
    if( this.pairingButtonColor != 'dark' )
    {
      onOff = false;
    }
    this.qccSrcHandler .setPairingOnOff(onOff).then( ret => {
      console.log("[DEVICE-SRC] change pairing success " + JSON.stringify(ret));
      this.zone.run( () => {
        if( this.pairingButtonColor == 'dark' )
        {
          this.pairingButtonColor = 'danger';
        }
        else
        {
          this.pairingButtonColor = 'dark';
        }
      });
    }).catch( ret => {
      console.log("[DEVICE-SRC] change pairing fail " + JSON.stringify(ret));
    });;
  }

  connectPdl(item, pdlRec)
  {
    item.close();

    if( !this.getHandler() )
    {
      return;
    }
    
    if( pdlRec.isMusicConnected )
    {
      // THe selected device is alreay connected
      // - just return
      return;
    }

    // Create a "conneting" prompt
    let connectingPrompt = this.alertCtrl.create({
      title: 'Connecting'
    });
    connectingPrompt.present();

    console.log("[DEVICE-SRC] Connenting PDL [" + pdlRec.addr + "]");
    this.qccSrcHandler.connectDevice(pdlRec.addr).then( ret => {
      console.log("[DEVICE-SRC] connect PDL success " + JSON.stringify(ret));
      connectingPrompt.dismiss();
      this.qccSrcHandler.refreshPdl();        
    }).catch( ret => {
      console.log("[DEVICE-SRC] connect PDL fail " + JSON.stringify(ret));
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

  disconnectPdl(item, pdlRec)
  {
    item.close();

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
    
    console.log("[DEVICE-SRC] Disconnecting device in PDL [" + pdlRec.addr + "]");
    this.qccSrcHandler.disconnectDevice(pdlRec.addr).then( ret => {
      console.log("[DEVICE-SRC] disconnect device in PDL success " + JSON.stringify(ret));
      disconnectingPrompt.dismiss();
      this.qccSrcHandler.refreshPdl();        
    }).catch( ret => {
      disconnectingPrompt.dismiss();
      console.log("[DEVICE-SRC] disconnect device in PDL fail " + JSON.stringify(ret));
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

  deletePdl(item, pdlRec)
  {
    item.close();

    if( !this.getHandler() )
    {
      return;
    }

    // Create a "Removing" prompt
    let removingPrompt = this.alertCtrl.create({
      title: 'Removing'
    });
    removingPrompt.present();
        
    console.log("[DEVICE-SRC] Removing device in PDL [" + pdlRec.addr + "]");
    this.qccSrcHandler.removePDL(pdlRec.addr).then( ret => {
      console.log("[DEVICE-SRC] remove device in PDL success " + JSON.stringify(ret));
      removingPrompt.dismiss();
      this.qccSrcHandler.refreshPdl();
    }).catch( ret => {
      removingPrompt.dismiss();
      console.log("[DEVICE-SRC] remove device in PDL fail " + JSON.stringify(ret));
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

}

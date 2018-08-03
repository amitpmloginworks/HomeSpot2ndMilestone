import { Component, NgZone } from '@angular/core';
import { Platform, Events, IonicPage } from 'ionic-angular';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AtCmdDispatcherService, BleDeviceInfo } from '../../providers/atcmd-dispatcher/atcmd-dispatcher.service';
import { ATCMDHDLDXS } from '../../providers/atcmd-dispatcher/atcmd-handler-dxs';

/**
 * Generated class for the FirmUpg8266Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-firm-upg-8266',
  templateUrl: 'firm-upg-8266.html',
})
export class FirmUpg8266Page {

  protected devInfo : BleDeviceInfo;

  protected dxsHandler : ATCMDHDLDXS.AtCmdHandler_DXS = null;


  upgradeButtonColor : string = 'dark';

  constructor
  (
    public navCtrl: NavController, 
    public navParams: NavParams,
    public dispatcher : AtCmdDispatcherService
  ) 
  {
    this.devInfo = this.navParams.get('devInfo');
  }

  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad FirmUpg8266Page');
  }

  private getHandler() : boolean
  {
    if( this.dxsHandler == null )
    {
      // this.dxsHandler = <ATCMDHDLQCCSRC.AtCmdHandler_QCC_SRC>this.dispatcher.getCmdChHandler(linkedList[foundIdx].uuid);
      this.dxsHandler = <ATCMDHDLDXS.AtCmdHandler_DXS>this.dispatcher.getCmdChHandler(this.devInfo.uuid);
    }
    else
    {
      return true;
    }

    if( this.dxsHandler == null )
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

  upgradeButtonPressed(event)
  {
    if( this.upgradeButtonColor == 'danger' )
    {
      return;
    }

    this.upgradeButtonColor = 'danger';

    //this.dispatcher.bleFirmwareUpgradeFor8266()
  }

}

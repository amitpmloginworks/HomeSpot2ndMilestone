import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { DataExchangerService } from '../../providers/data-exchanger/data-exchanger.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  bleDevices: { [uuid: string] : {}; } = {};

  constructor(
    public platform: Platform, 
    public navCtrl: NavController,
    public dataExchangerService: DataExchangerService
  ) {
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //this.bleInit();
    });
  }

  bleInit() {
    console.log("initiating DX ...");
    this.dataExchangerService.init(this.bleSysEventCallback).catch((obj)=> {
      console.log("init failed");
      console.log(obj);
    }).then((obj) => {
      if( obj.state == 'init' ) {
        console.log("init success");
        //console.log(obj);

        // Start scanning
        // - this function should be removed to the code where it should trigger BLE scan
        //   e.g. button press to scan or pull down device list to scan
        // - this is call here only for demo purpose.
        this.bleStartScan();

        // Stop scanning
        // - this function should be removed together with bleStartScan()
        // - it create a timer of 60s (or whatever) to stop scanning
        setTimeout(() => {
          console.log("BLE Device Scan List:")
          console.log(this.bleDevices);
          this.bleStopScan();

          // Connecting 
          // - check closest proximity device
          // - pick the highest RSSI value (power level)
          // - for normal application it is not neccessary.App should show the list of
          //   devices and let the user to pick the one to connect
          //
          var uuid = '';
          var rssi = -127;
          for (let uid in this.bleDevices) {
            let device:any = this.bleDevices[uid];
            if( !device.active ) {
              continue;
            }
            if( device.rssi > rssi )
            {
              rssi = device.rssi;
              uuid = uid;
            }
          }

          console.log("Connecting device: " + uuid);

          if( uuid != '' )
          {
            // Device exists. Make connection
            this.bleConnect(uuid);
          }

        }, 5000);
      }
    });
  }

  bleStartScan() {
    if (!this.dataExchangerService.inited ) {
      return false;
    }
    
    if( this.dataExchangerService.isScanning ) {
      return false;
    }

    // Start BLE scanning
    // - the success and failure functions will be called repeatively.
    // - for any new device found, it will be added in a list (bleDevices)
    // - app should refresh the screen with the list.
    this.dataExchangerService.startScan(
      // success
      this.bleScanSuccessCallback.bind(this),
      // failure
      (obj) => {
        console.log("scan failed");
        console.log(obj);
      }
    );
    return true;
  }

  bleStopScan() {
    this.dataExchangerService.stopScan();
  }

  bleConnect(uuid: string) {
    if (!this.dataExchangerService.inited ) {
      return false;
    }
    
    // Stop scanning
    if( this.dataExchangerService.isScanning ) {
      this.dataExchangerService.stopScan();
    }

    this.dataExchangerService.connect(uuid,
      this.bleConnectSuccessCallback.bind(this),
      (obj) => {
        console.log("BLE connect not successful");
        console.log(obj);
      },
      (obj) => {},  // RxData Callback
      (obj) => {},  // RxCmdRsp Callback
    );
    
    return true;
  }

  bleDisconnect(uuid : string):Promise<any> {
    return this.dataExchangerService.disconnect(uuid);
  }

  bleScanSuccessCallback(obj) {
    var bleDevice = {};

    //console.log("scan success");
    //console.log(obj);
    if (obj.state == 'active') {
      bleDevice = {name: obj.info.NAME, rssi: obj.info.RSSI, active: true};
      this.bleDevices[obj.info.UUID] = bleDevice;
    }
    else {
      if( this.bleDevices[obj.info.UUID] ) {
        this.bleDevices[obj.info.UUID.active] = false;
      }
    }

    // Here should refresh (or trigger a refresh) to update the consumers of bleDevices
    // - add your code here
  }

  bleConnectSuccessCallback(obj) {
    if( obj.state == 'connected' ) {
      console.log(obj.info.UUID + " connected");
      console.log(obj);

      // Test with AT+VS? command
      setInterval(() => {
        console.log("Sending AT+VS?")

        this.dataExchangerService.sendDxCmd(null, "AT+VS?").then( obj => {
          console.log("AT+VS?" + " sent success" )
        }).catch( obj => {
          console.log("AT+VS?" + " sent failed" )
        });
      }, 2000);
    }
    else if( obj.state == 'disconnected' ) {
      console.log(obj.info.UUID + " disconnected");
      console.log(obj);
    }
  }

  bleSysEventCallback(obj) {
    console.log("SysEvt: " + obj.state);
  }
}

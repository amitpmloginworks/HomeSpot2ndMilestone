# How to enable DataExchanger in an exisiting Ionic app
This session will instruct you how to make an existing Ionic app to communicate with DataExchanger BLE devices.

**WARNING: Only Ionic v2/v3 and up app is supported. It won't work with Ionic v1 app.**

## Step 1 - Clone The ionic3-sample Project
Find a work space directory where you can clone the [ionic3-sample](https://github.com/GT-tronics/ionic3-sample) project.

Create the subdirectory as follows:
```
cd ~/Development
mkdir -p ionic/test
```
Clone [ionic3-sample](https://github.com/GT-tronics/ionic3-sample)
```
cd ~/Development/ionic/test/
git clone https://github.com/GT-tronics/ionic3-sample.git
```

## Step 2 - Clone and Install DataExchanger Cordova Plugin
Until we publish the plugin into the npm registry, the plugin is required to be cloned locally before installation. 

Clone [cordova-plugin-dataexchanger](https://github.com/GT-tronics/cordova-plugin-dataexchanger)
```
cd ~/Development
mkdir -p cordova/plugin
git clone https://github.com/GT-tronics/cordova-plugin-dataexchanger.git
cd ~/path/to/your/ionic/app
ionic cordova plugin add ~/Development/cordova/plugin/cordova-plugin-dataexchanger
```

## Step 3 - Make Some Patches
### CDVPLuginResult
This patch allows the the nested NSDictionary object which contains NSData be able to convert JSON string probably. 
```
cd ~/Development/test/ionic3-sample/
cp ./patches/ios/CDVPluginResult/* ~/your/own/ionic/app/platforms/ios/CordovaLib/Classes/Public
```
### Android Support V4
The DataExchanger cordova plugin requires this library
```
edit ~/your/own/ionic/app/platforms/android/app/build.gradle
```
Add the line **implementation 'com.android.support:support-v4:+'** in the dependency section
```
...
dependencies {
    implementation fileTree(include: '*.jar', dir: 'libs')
    // SUB-PROJECT DEPENDENCIES START
    implementation project(path: ':CordovaLib')
    // SUB-PROJECT DEPENDENCIES END
    implementation 'com.android.support:support-v4:+'
}
...
```

## Step 4 - Copy DataExchanger and AtCmdDispatcher Provider Files
There are two providers - *data-exchanger.service* and *atcmd-dispatcher* required to interface with the DataExchanger corodova plugin. Copy both to your ionic project.
```
cp ~/Development/ionic/test/ionic3-sample/src/providers/data-exchanger ~/your/own/ionic/app/src/providers
cp ~/Development/ionic/test/ionic3-sample/src/providers/atcmd-dispatcher ~/your/own/ionic/app/src/providers
```

## Step 5 - Modify app.modules.ts
Add DataExchangerService and AtCmdDispatcherService.
```
...
import { DataExchangerService } from '../providers/data-exchanger/data-exchanger.service';
import { AtCmdDispatcherService } from '../providers/atcmd-dispatcher/atcmd-dispatcher.service';
...
@NgModule({
...
  providers: [
    ...
    DataExchangerService,
    AtCmdDispatcherService,
    ...
  ]
})
export class AppModule {}
```

## Step 6 - Add DataExchanger Service
Finally, you need to inject DataExchanger service into your application. Take a look at ~/Development/ionic/test/ionic3-sample/src/pages/home/home.ts. The key add-ons are shown in below.
```
...
import { AtCmdDispatcherService, BleDeviceInfo } from '../../providers/atcmd-dispatcher/atcmd-dispatcher.service';

// Depending on the type of hardware, import the associated handlers
import { ATCMDHDLQCCSNK } from '../../providers/atcmd-dispatcher/atcmd-handler-qcc-sink';
import { ATCMDHDLQCCSRC } from '../../providers/atcmd-dispatcher/atcmd-handler-qcc-src';

...

export class HomePage {
    ...
    devInfo : BleDeviceInfo;
    
    constructor(
        ...
        public dispatcher : AtCmdDispatcherService
    ) 
    {
        this.devInfo = null;
    }

    ionViewDidLoad() {
    this.platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        ...
        this.dispatcher.bleInit();
    });
}

...

```


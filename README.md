# Introduction
This is an Ionic app example integrated with DataExchanger BLE communication library. You can use this app as a template to start building hybrid mobile application that can communicate with BLE devices. Or if you already have a Ionic app, you can port the DataExchanger providers files to your app and make your app to communicate with BLE devices See [How to enable DataExchanger in existing Ionic apps](https://github.com/GT-tronics/ionic3-sample/blob/master/docs/Enable-DX-In-Existing-App.md).

## Step 0 - Install Ionic and Prepare Cordova for iOS and Android Building Platform
If you have not install Ionic and prepare the cordova building platform, follow these links:
* [Install Ionic](https://ionicframework.com/getting-started)
* [Prepare Cordova iOS Platform](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html)
* [Prepare Corodva Android Platform](https://cordova.apache.org/docs/en/latest/guide/platforms/android/#requirements-and-support)
## Step 1 - Clone The Projects
Find a work space directory where you can clone the [ionic3-sample](https://github.com/GT-tronics/ionic3-sample) and [cordova-plugin-dataexchanger](https://github.com/GT-tronics/cordova-plugin-dataexchanger) projects.

Create the subdirectory as follows:
```
cd ~/Development
mkdir -p ionic/test
mkdir -p cordova/plugin
```
Clone [ionic3-sample](https://github.com/GT-tronics/ionic3-sample)
```
cd ~/Development/ionic/test/
git clone https://github.com/GT-tronics/ionic3-sample.git
```
Clone [cordova-plugin-dataexchanger](https://github.com/GT-tronics/cordova-plugin-dataexchanger)
```
cd ~/Development/cordova/plugin/
git clone https://github.com/GT-tronics/cordova-plugin-dataexchanger.git
```
## Step 2 - Create cordova platforms
```
cd ~/Development/ionic/test/ionic3-sample/
ionic cordova platform add iOS
ionic cordova platform add android
```
## Step 3 - Install DataExchanger cordova plugin
```
cd ~/Development/ionic/test/ionic3-sample/
ionic cordova plugin add ../../../cordova/plugin/cordova-plugin-dataexchanger
```
## Step 4 - Make Some Patches
### CDVPLuginResult
This patch allows the the nested NSDictionary object which contains NSData be able to convert JSON string probably. 
```
cd ~/Development/test/ionic3-sample/
cp ./patches/ios/CDVPluginResult/* ./platforms/ios/CordovaLib/Classes/Public
```
### Android Support V4
The DataExchanger cordova plugin requires this library
```
edit ~/Development/test/ionic3-sample/platforms/android/app/build.gradle
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
## Step 5 - Build And Run The Apps
```
cd ~/Development/test/ionic3-sample/
ionic cordova run ios
```
and/or
```
cd ~/Development/test/ionic3-sample/
ionic cordova run android
```

# Further References
* [How to enable DataExchanger in existing Ionic apps](https://github.com/GT-tronics/ionic3-sample/blob/master/docs/Enable-DX-In-Existing-App.md)
* [DataExchanger Stack For Ionic Mobile](https://github.com/GT-tronics/ionic3-sample/blob/master/docs/api-summary.md)
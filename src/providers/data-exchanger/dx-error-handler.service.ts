import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AlertController } from 'ionic-angular';
declare var cordova: any;

@Injectable()
export class DxErrHandlerService {
    errorUnsupported = {};

    constructor(
        private alertCtrl: AlertController,
    ) 
    {
        this.errorUnsupported = {
            error: "unsupported",
            message: "Operation unsupported"
        };
    }

    showErrorAlert() {
        let alert = this.alertCtrl.create({
            title: this.errorUnsupported['error'],
            subTitle: this.errorUnsupported['message'],
            buttons: ['Ok']
        });
        alert.present();
    }

    init(params):Promise<any> {
        return new Promise(function (resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.init(
                    params.devCount,
                    params.proximityPowerLevel,
                    params.discoveryActiveTimeout,
                    params.autoConnect,
                    params.enableCommandChannel,
                    params.enableChannelScrambler,
                    params.enableTransmitBackpressure,
                    params.serviceUUIDStrings,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        });
    }

    isEnabled():Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.isEnabled(
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        });
    }

    isConnected(params):Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.isConnected(
                    params.uuid,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }

    startScan():Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                console.log("undefined");
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.startScan(
                    function(obj) {
                        console.log("startScan");
                        console.log(obj);
                        resolve(obj);
                    },
                    function(obj) {
                        console.log("startScan fail");
                        console.log(obj);
                        reject(obj);
                    }
                )
            }
        })
    }

    stopScan():Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.stopScan(
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }

    connect(params):Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.connect(
                    params.uuid,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }

    disconnect(params):Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.disconnect(
                    params.uuid,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }

    sendData(params):Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.disconnect(
                    params.uuid,
                    params.data,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }

    sendCmd(params):Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.sendCmd(
                    params.uuid,
                    params.cmd,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }

    readTxCredit(params):Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.readTxCredit(
                    params.uuid,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }

    enableRxDataNotification(params):Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.enableRxDataNotification(
                    params.uuid,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }

    disableRxDataNotification(params):Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.disableRxDataNotification(
                    params.uuid,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }

    enableRxCmdNotification(params):Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.enableRxCmdNotification(
                    params.uuid,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }

    disableRxCmdNotification(params):Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.disableRxCmdNotification(
                    params.uuid,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }

    enableTxCreditNotification(params):Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.enableTxCreditNotification(
                    params.uuid,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }

    disableTxCreditNotification(params):Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.disableTxCreditNotification(
                    params.uuid,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }

    retrieveFirmwareMeta(params):Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.retrieveFirmwareMeta(
                    params.uuid,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }

    primeFirmwareBinary(params):Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.primeFirmwareBinary(
                    params.uuid,
                    params.firmBin,
                    params.firmName,
                    params.interleaveCommand,
                    params.interleaveCount,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }

    switchFirmwareToSlot(params):Promise<any> {
        return new Promise(function(resolve, reject) {
            if (cordova.plugin.dx === undefined) {
                reject(this.showErrorAlert());
            } else {
                cordova.plugin.dx.switchFirmwareToSlot(
                    params.uuid,
                    params.slotIdx,
                    params.keepConfig,
                    function(obj) {
                        resolve(obj);
                    },
                    function(obj) {
                        reject(obj);
                    }
                )
            }
        })
    }



    // return new Promise(function(resolve, reject) {
    //     if (cordova.plugin.dx === undefined) {
    //         reject(this.showErrorAlert());
    //     } else {
            
    //     }
    // })
}
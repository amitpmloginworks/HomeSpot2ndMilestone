import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ToastController } from 'ionic-angular';

import { ResultModule } from './cloud-response-data.model';
declare var window: any;

@Injectable()
export class CloudResultService {
    BASE_URI = 'https://gt-test-fns1.azurewebsites.net/api/tosm-dxsend/alpha/devid/';
    CODE_FIELD = 'code';
    CMD_FIELD = 'cmd';
    CMD_GET_INFO = "AT%2BBTREE%3D1";


    constructor(public http: Http, private toastCtrl: ToastController ) {}
    // getCloudData() {
        // let baseUrl = 'http://gt-test-fns1.azurewebsites.net/api/tosm-dxsend/alpha/devid/{FFFFFFFFFFFF}?code=HXhn8rWp6rm8Ixg1zMc2zvJGXC4elH9sEDcmaiv2k/tnsnNFxP57vg==&cmd=AT%2BBINFO%3D1';
        // let encodedPath = encodeURI(baseUrl);
        // let timeoutMS = 10000;

        // this.http.get(encodedPath)
        //     .timeout(timeoutMS)
        //     .map(res => res.json()).subscribe(data => {
        //         let responseData = data;
        //         console.log(responseData);
        //     },
        //     err => {
        //         console.log('error in ETPhoneHome');
        //     }
        // );
    // }
    // getBleInfoData(devId: string) {
    //     // let dataArray: BleInfoModule;
    //     let responseArray: {cmd: string, id: number, name: string, dev_id: string, dev_type: number};
    //     let stringData: string;
    //     let resultString = {};

    //     this.getCloudData(devId, this.CMD_GET_INFO)
    //     .then(data => {
    //         if (typeof data.response == "string") {
    //             stringData = data.response;
    //             resultString = stringData.split(":").pop().split(",");

    //             responseArray = {cmd: stringData.substring(0, stringData.indexOf(":")), id: Number(resultString[0]), name: resultString[1], dev_id: resultString[2], dev_type: Number(resultString[3])};
    //         }
    //     });
    //     return responseArray;
    // }
    
    getCloudData(devId: string, cmd: string): Promise<ResultModule> {
        return this.http.get(
            this.BASE_URI
            + devId
            + '?' + this.CODE_FIELD + '='
            + "HXhn8rWp6rm8Ixg1zMc2zvJGXC4elH9sEDcmaiv2k/tnsnNFxP57vg=="
            + '&' + this.CMD_FIELD + '='
            + cmd)
        .toPromise()
        .then(response => response.json() as ResultModule)
        .catch(this.handleError)
        .catch(error => {
            this.showNetworkErrorToast();
        });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    showNetworkErrorToast() {
        const toast = this.toastCtrl.create({
          message: 'Network Error, please try it again!',
          duration: 2000
        });
        // toast.onDidDismiss(this.dismissHandler);
        toast.present();
      }
    
}
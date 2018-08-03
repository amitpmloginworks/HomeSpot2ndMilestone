import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the FeatureRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feature-request',
  templateUrl: 'feature-request.html',
})
export class FeatureRequestPage {
  public subjectn;
   public email;
  constructor(public navCtrl: NavController, public navParams: NavParams, public socialsharing:SocialSharing,public alertCtrl:AlertController, public toastCtrl:ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeatureRequestPage');
  }

  private SendBtn()
  {
    if(this.subjectn==undefined || this.subjectn=="" )
    {
      this.toastCtrl.create({ message: "Subject is required.", duration: 3000, position: 'top' }).present();
      return;
    }
    let alert = this.alertCtrl.create({
      title: 'Message',
      inputs: [
        {
          name: 'message',
          placeholder: 'Enter Meassage'
        }
        
      ],
      buttons: [
        
        {
          text: 'Send',
          handler: data => {
           
            this.socialsharing.shareViaEmail(data.message, this.subjectn, [this.email]).then((data)=>{
              this.toastCtrl.create({ message: "Email Sent Successfully.", duration: 3000, position: 'top' }).present();
              this.subjectn="";

              return;
            }).catch((err)=>{
             
            });

          }
        }
      ]
    });
    alert.present();
  }
}//end

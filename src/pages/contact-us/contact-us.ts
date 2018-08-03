import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the ContactUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
  subjectn
  email
  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl:MenuController,public socialsharing:SocialSharing,public alertCtrl:AlertController, public toastCtrl:ToastController) {
  }


  SendBtn()
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



  ionViewWillEnter() {
    console.log('ion will Enter')
    //closing right side menu
    this.menuCtrl.swipeEnable( false, 'menu2' );
}

}

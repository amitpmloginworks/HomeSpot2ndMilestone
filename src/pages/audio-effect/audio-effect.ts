import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, MenuController } from 'ionic-angular';

import {LrReceiverPage } from '../lr-receiver/lr-receiver';

import { Chart } from 'chart.js';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

/**
 * Generated class for the AudioEffectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-audio-effect',
  templateUrl: 'audio-effect.html',
})
export class AudioEffectPage {

  @ViewChild('lineCanvas') lineCanvas;
 
  lineChart: any;

  constructor(public menuCtrl:MenuController,public  nativePageTransitions: NativePageTransitions, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController) {
  }


  ionViewWillEnter() {
    console.log('ion will Enter')
    //closing right side menu
    this.menuCtrl.swipeEnable( false, 'menu2' );
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AudioEffectPage');
 
    let gradient = this.lineCanvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0.5, '#466042');
    
    gradient.addColorStop(1, 'transparent');

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        
          labels: ["100", "500","1k", "2k", "20K"],
          datasets: [
              { 
               responsive:false,
              
                  fill: true,
                  lineTension: 0.5,
                  backgroundColor: gradient, 
                  borderColor: "rgb(112, 176, 32)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(255,255,255, 1)",
                  pointBackgroundColor: "rgba(255,255,255, 1)",
                  pointBorderWidth: 3,
                  pointHoverRadius: 8,
                  pointHoverBackgroundColor: "rgba(255,255,255, 1)",
                  pointHoverBorderColor: "rgba(255,255,255, 1)",
                  pointHoverBorderWidth: 10,
                  pointRadius: 5,
                  pointHitRadius: 10,
                  data: [20,60, 100,60,20  ],
                  spanGaps: true,
              }
          ]
      },
      options: {
        maintainAspectRatio: true,
        responsive:false,
        bezierCurve : false,

        legend: {
          display: true ,
          scaleShowLabels : true,
        labels: {
            fontColor: "#333",
            fontSize: 0,
            width:0,
            height:0,
            boxWidth: 0
           
        }
      
     
      },
      
        scales: {

          yAxes : [{
              display:false,
              ticks: {
                beginAtZero: true,
                fontColor:'#4c5c69'
              }
          }],
          tooltips:{
          
            
          }

        
       },
       tooltips:{
     

       }
   }
});


  }

  moveToLRReceiver(){
    let options:NativeTransitionOptions={
      direction:'right',
      duration:500,
      slowdownfactor:-1,
      slidePixels:0
  }
  this.nativePageTransitions.slide(options);
 this.navCtrl.pop();
  }

eqOptions(){
  let actionSheet = this.actionSheetCtrl.create({
    title: 'EQ Options',
    buttons: [
      {
        text: 'Pop',
      
        handler: () => {
          console.log('Pop clicked');
        }
      },
      {
        text: 'Jass',
        handler: () => {
          console.log('Jass clicked');
        }
      },
      {
        text: 'Clasical',
        handler: () => {
          console.log('Clasical clicked');
        }
      },
      {
        text: 'Voice',
        handler: () => {
          console.log('Voice clicked');
        }
      },
      {
        text: 'Flat',
        handler: () => {
          console.log('Flat clicked');
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });

  actionSheet.present();

}

saveEQ(){
  let alert = this.alertCtrl.create({
    title: 'Save EQ',
    subTitle:"Enter the name of the EQ",
    inputs: [
      {
        name: 'username',
        placeholder: "My present"
      },
    
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Done',
        role: 'done',
        handler: data => {
          console.log('Done clicked');
        }
      }
    ]
  });
  alert.present();
}

}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomizationPage } from './customization';

@NgModule({
  declarations: [
    CustomizationPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomizationPage),
  ],
})
export class CustomizationPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeatureRequestPage } from './feature-request';

@NgModule({
  declarations: [
    FeatureRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(FeatureRequestPage),
  ],
})
export class FeatureRequestPageModule {}

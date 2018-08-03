import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimeoutsPage } from './timeouts';

@NgModule({
  declarations: [
    TimeoutsPage,
  ],
  imports: [
    IonicPageModule.forChild(TimeoutsPage),
  ],
})
export class TimeoutsPageModule {}

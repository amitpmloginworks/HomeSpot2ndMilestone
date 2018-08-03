import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CodecPage } from './codec';

@NgModule({
  declarations: [
    CodecPage,
  ],
  imports: [
    IonicPageModule.forChild(CodecPage),
  ],
})
export class CodecPageModule {}

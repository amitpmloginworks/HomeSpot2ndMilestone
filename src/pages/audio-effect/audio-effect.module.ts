import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AudioEffectPage } from './audio-effect';

@NgModule({
  declarations: [
    AudioEffectPage,
  ],
  imports: [
    IonicPageModule.forChild(AudioEffectPage),
  ],
})
export class AudioEffectPageModule {}

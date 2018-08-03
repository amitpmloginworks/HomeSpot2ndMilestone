import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductRegistrationPage } from './product-registration';

@NgModule({
  declarations: [
    ProductRegistrationPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductRegistrationPage),
  ],
})
export class ProductRegistrationPageModule {}

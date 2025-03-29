import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { ProductViewComponent } from './components/product-view/product-view.component';

@NgModule({
  declarations: [
    PaymentComponent,
    ProductViewComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    ReactiveFormsModule,
    StepsModule,
    ButtonModule,
    HttpClientModule
  ]
})
export class PaymentModule { }

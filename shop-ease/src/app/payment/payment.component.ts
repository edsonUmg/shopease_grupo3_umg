import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { OrderService } from './services/order/order.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentComponent implements OnInit {
  activeIndex: number = 0;
  active: number = 0;
  form: FormGroup = this.fb.group({});
  items: MenuItem[] = [{ label: "Dirección" }, { label: "Envío" }, { label: "Pago" }];
  order: any = null;
  total: number = 0;
  subTotal: number = 0;
  taxes: number = 0;

  constructor(private fb: FormBuilder, private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getOrder().subscribe(order => {
      this.order = order;
      this.getSummary(this.order);
    });

    this.form = this.fb.group(
      {
        direccion: ['', Validators.required],
        envio: ['', [Validators.required, Validators.required]],
        cardName: ['', Validators.required],
        cardNumber: ['', Validators.required],
        expDate: ['', Validators.required],
        cvv: ['', Validators.required]
      }
    );
  }

  getSummary(order: any): void {
    this.total = order.products.reduce((acc: any, producto: any) => {
      return acc + parseFloat(producto.price);
    }, 0);
    this.subTotal = this.total - (this.total * 0.12);
    this.taxes = this.subTotal * 0.12;
  }

  siguientePaso(): void {
    this.active += 1;
  }

  pasoAnterior(): void {

  }

  enviarFormulario(): void {

  }
}

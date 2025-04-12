import { Component, Input } from '@angular/core';

@Component({
  selector: 'shopease-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent {
  @Input() product: any;
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CheckoutModule } from '@spartacus/core';
import { CartComponentModule } from '../../cms-components/checkout/cart/cart.module';
import { CheckoutOrchestratorModule } from './components/checkout-orchestrator/checkout-orchestrator.module';
import { CheckoutOrderSummaryModule } from './components/checkout-order-summary/checkout-order-summary.module';
import { CheckoutProgressModule } from './components/checkout-progress/checkout-progress.module';
// tslint:disable-next-line
import { CheckoutProgressMobileTopModule } from './components/checkout-progress/checkout-progress-mobile-top/checkout-progress-mobile-top.module';
// tslint:disable-next-line
import { CheckoutProgressMobileBottomModule } from './components/checkout-progress/checkout-progress-mobile-bottom/checkout-progress-mobile-bottom.module';
import { DeliveryModeModule } from './components/delivery-mode/delivery-mode.module';
import { OrderConfirmationModule } from './components/order-confirmation/order-confirmation.module';
import { PaymentMethodModule } from './components/payment-method/payment-method.module';
import { PlaceOrderModule } from './components/place-order/place-order.module';
import { PromotionsModule } from './components/promotions/promotions.module';
import { ReviewSubmitModule } from './components/review-submit/review-submit.module';
import { ShippingAddressModule } from './components/shipping-address/shipping-address.module';
import { CheckoutConfigService } from './checkout-config.service';

@NgModule({
  imports: [
    CommonModule,
    CartComponentModule,
    CheckoutModule,
    CheckoutOrchestratorModule,
    CheckoutOrderSummaryModule,
    CheckoutProgressModule,
    CheckoutProgressMobileTopModule,
    CheckoutProgressMobileBottomModule,
    DeliveryModeModule,
    OrderConfirmationModule,
    PaymentMethodModule,
    PlaceOrderModule,
    PromotionsModule,
    ReviewSubmitModule,
    ShippingAddressModule,
  ],
  // @todo: should we keep below provider here?
  providers: [CheckoutConfigService],
})
export class CheckoutComponentModule {}

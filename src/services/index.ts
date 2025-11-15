/**
 * Centraliza todos os serviços da aplicação
 */

export { authService } from './auth.service';
export { storageService } from './storage.service';
export { catalogService } from './catalog.service';
export { addressService } from './address.service';
export { orderService } from './order.service';
export { checkoutService } from './checkout.service';
export { userService } from './user.service';
export { adminSettingsService } from './admin-settings.service';
export { adminDashboardService } from './admin-dashboard.service';
export { adminCustomerService } from './admin-customer.service';
export { adminOrderService } from './admin-order.service';
export { authenticatedFetch, fetchWithInterceptor } from './http-interceptor';


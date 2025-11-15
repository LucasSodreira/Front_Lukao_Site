import { Routes, Route, useLocation } from 'react-router-dom';

// Core
import { AuthProvider } from '@/core/context/AuthProvider';
import { ThemeProvider } from '@/core/context/ThemeContext';
import { CheckoutProvider } from '@/features/checkout/hooks';

// Shared Components
import { Navbar, Footer } from '@/shared/components/layout';
import { ErrorBoundary, PrivateRoute, PublicRoute, AdminRoute, NotFoundPage } from '@/shared/components/common';

// Checkout Guards
import { CheckoutRoute, CheckoutStepGuard } from '@/features/checkout/components';

// Features - Pages
import { LoginPage, RegisterPage } from '@/features/auth/pages';
import { ProductDetailPage, CreateProductPage, ProductListPage } from '@/features/products/pages';
import { CartPage } from '@/features/cart/pages';
import { ProfilePage, ProfileOrdersPage, ProfileDataPage, ProfileSecurityPageWrapper } from '@/features/profile/pages';
import { OrderDetailPage } from '@/features/orders/pages';
import { HomePage } from '@/features/home/pages';
import { CheckoutPage, CheckoutAddressPage, CheckoutPaymentPage, CheckoutReviewPage, CheckoutSuccessPage, CheckoutCancelPage } from '@/features/checkout/pages';
import { DashboardPage, AdminLoginPage, CreateAccountPage, CustomersPage, EditCustomerPage, OrderDetailsPage, OrderInvoicePage, OrdersPage, PaymentsPage, ProductManagementPage, ProductFormPage, ReportsPage, ReviewsManagementPage, SettingsPage } from '@/features/admin';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <ThemeProvider>
        <CheckoutProvider>
          <div className="min-h-full flex flex-col bg-white dark:bg-gray-950">
            {!isAdminRoute && <Navbar />}
            <main className="flex-1">
              <Routes>
                {/* Rotas públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ErrorBoundary><ProductListPage /></ErrorBoundary>} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                
                {/* Rotas de autenticação - redireciona se já estiver logado */}
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                
                {/* Rotas protegidas - requer autenticação */}
                <Route path="/products/create" element={<PrivateRoute><CreateProductPage /></PrivateRoute>} />
                
                {/* Rotas de checkout com proteção em dupla camada */}
                <Route path="/checkout" element={<CheckoutRoute><CheckoutPage /></CheckoutRoute>} />
                <Route path="/checkout/address" element={<CheckoutRoute><CheckoutStepGuard step="address"><CheckoutAddressPage /></CheckoutStepGuard></CheckoutRoute>} />
                <Route 
                  path="/checkout/payment" 
                  element={
                    <CheckoutRoute>
                      <CheckoutStepGuard step="payment">
                        <CheckoutPaymentPage />
                      </CheckoutStepGuard>
                    </CheckoutRoute>
                  } 
                />
                <Route 
                  path="/checkout/review" 
                  element={
                    <CheckoutRoute>
                      <CheckoutStepGuard step="review">
                        <CheckoutReviewPage />
                      </CheckoutStepGuard>
                    </CheckoutRoute>
                  } 
                />
                <Route 
                  path="/checkout/success/:orderId" 
                  element={
                    <PrivateRoute>
                      <CheckoutSuccessPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/checkout/cancel" 
                  element={
                    <PrivateRoute>
                      <CheckoutCancelPage />
                    </PrivateRoute>
                  } 
                />
                
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/profile/data" element={<PrivateRoute><ProfileDataPage /></PrivateRoute>} />
                <Route path="/profile/security" element={<PrivateRoute><ProfileSecurityPageWrapper /></PrivateRoute>} />
                <Route path="/profile/orders" element={<PrivateRoute><ProfileOrdersPage /></PrivateRoute>} />
                <Route path="/orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
                
                {/* Rotas Admin - sem Navbar/Footer */}
                <Route path="/admin/login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
                
                {/* Admin sub-pages imported from features/admin */}
                <Route path="/admin/dashboard" element={<AdminRoute><DashboardPage /></AdminRoute>} />
                <Route path="/admin/create-account" element={<AdminRoute><CreateAccountPage /></AdminRoute>} />
                <Route path="/admin/customers" element={<AdminRoute><CustomersPage /></AdminRoute>} />
                <Route path="/admin/customers/:id/edit" element={<AdminRoute><EditCustomerPage /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><OrdersPage /></AdminRoute>} />
                <Route path="/admin/orders/:id" element={<AdminRoute><OrderDetailsPage /></AdminRoute>} />
                <Route path="/admin/payments" element={<AdminRoute><PaymentsPage /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><ProductManagementPage /></AdminRoute>} />
                <Route path="/admin/products/create" element={<AdminRoute><ProductFormPage /></AdminRoute>} />
                <Route path="/admin/products/:id" element={<AdminRoute><ProductFormPage /></AdminRoute>} />
                <Route path="/admin/reports" element={<AdminRoute><ReportsPage /></AdminRoute>} />
                <Route path="/admin/reviews" element={<AdminRoute><ReviewsManagementPage /></AdminRoute>} />
                <Route path="/admin/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
                <Route path="/admin/invoices/:id" element={<AdminRoute><OrderInvoicePage /></AdminRoute>} />
                
                {/* Rota 404 - Página não encontrada */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
              {!isAdminRoute && <Footer />}
            </div>
          </CheckoutProvider>
        </ThemeProvider>
      </AuthProvider>
  );
}

export default App;

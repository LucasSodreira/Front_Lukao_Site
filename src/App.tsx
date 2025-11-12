import { Routes, Route } from 'react-router-dom';

// Core
import { AuthProvider } from '@/core/context/AuthProvider';
import { ThemeProvider } from '@/core/context/ThemeContext';
import { CheckoutProvider } from '@/features/checkout/hooks';

// Shared Components
import { Navbar, Footer } from '@/shared/components/layout';
import { ErrorBoundary, PrivateRoute, PublicRoute, NotFoundPage } from '@/shared/components/common';

// Checkout Guards
import { CheckoutRoute, CheckoutStepGuard } from '@/features/checkout/components';

// Features - Pages
import { LoginPage, RegisterPage } from '@/features/auth/pages';
import { ProductDetailPage, CreateProductPage, ProductsPage } from '@/features/products/pages';
import { CartPage } from '@/features/cart/pages';
import { ProfilePage } from '@/features/profile/pages';
// import { OrdersPage, OrderConfirmationPage } from '@/features/orders/pages';
import { HomePage } from '@/features/home/pages';
import { CheckoutPage, CheckoutAddressPage, CheckoutPaymentPage, CheckoutReviewPage, CheckoutSuccessPage, CheckoutCancelPage } from '@/features/checkout/pages';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CheckoutProvider>
          <div className="min-h-full flex flex-col bg-white dark:bg-gray-950">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Rotas públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ErrorBoundary><ProductsPage /></ErrorBoundary>} />
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
                  path="/checkout/success" 
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
                {/* <Route path="/order-confirmation/:orderId" element={<PrivateRoute><OrderConfirmationPage /></PrivateRoute>} /> */}
                {/* <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} /> */}
                
                {/* Rota 404 - Página não encontrada */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
              <Footer />
            </div>
          </CheckoutProvider>
        </ThemeProvider>
      </AuthProvider>
  );
}

export default App;

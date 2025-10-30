import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';

// Core
import { client } from '@/graphql/client';
import { AuthProvider } from '@/core/context/AuthProvider';
import { ThemeProvider } from '@/core/context/ThemeContext';

// Shared Components
import { Navbar, Footer } from '@/shared/components/layout';
import { ErrorBoundary } from '@/shared/components/common';
import { Container } from '@/ui/Container';

// Features - Pages
import { LoginPage, RegisterPage } from '@/features/auth/pages';
import { ProductsPage, ProductDetailPage } from '@/features/products/pages';
import { CartPage } from '@/features/cart/pages';
import { ProfilePage } from '@/features/profile/pages';
import { OrdersPage, OrderConfirmationPage } from '@/features/orders/pages';
import { HomePage } from '@/features/home/pages';
import { CheckoutPage, CheckoutSuccessPage, CheckoutCancelPage } from '@/features/checkout/pages';

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <div className="min-h-full flex flex-col bg-white dark:bg-gray-950">
              <Navbar />
              <main className="flex-1">
                <Container className="py-8 sm:py-10">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/products" element={<ErrorBoundary><ProductsPage /></ErrorBoundary>} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout/:orderId" element={<CheckoutPage />} />
                    <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
                    <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                  </Routes>
                </Container>
              </main>
              <Footer />
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;

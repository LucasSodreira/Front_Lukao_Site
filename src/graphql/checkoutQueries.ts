import { gql } from '@apollo/client';

// Mutations para Checkout
export const AUTHENTICATED_CHECKOUT = gql`
  mutation Checkout($shippingAddressId: ID!, $notes: String) {
    checkout(shippingAddressId: $shippingAddressId, notes: $notes) {
      id
      status
      totalAmount
      shippingCost
      items {
        id
        product {
          id
          title
        }
        quantity
        totalPrice
      }
      createdAt
    }
  }
`;

export const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($orderId: ID!) {
    createPaymentIntent(orderId: $orderId) {
      paymentIntentId
      clientSecret
      status
      amount
      currency
    }
  }
`;

export const PROCESS_STRIPE_PAYMENT = gql`
  mutation ProcessStripePayment($orderId: ID!, $paymentIntentId: String!) {
    processStripePayment(orderId: $orderId, paymentIntentId: $paymentIntentId) {
      success
      message
      orderId
      paymentIntentId
      status
      amount
    }
  }
`;

export const CREATE_CHECKOUT_SESSION = gql`
  mutation CreateCheckoutSession($orderId: ID!, $successUrl: String!, $cancelUrl: String!) {
    createCheckoutSession(orderId: $orderId, successUrl: $successUrl, cancelUrl: $cancelUrl) {
      sessionId
      url
      orderId
    }
  }
`;

// Query para buscar dados do pedido (correção de segurança)
export const GET_ORDER_BY_ID = gql`
  query GetOrderById($orderId: ID!) {
    order(id: $orderId) {
      id
      status
      totalAmount
      shippingCost
      items {
        id
        product {
          id
          title
        }
        quantity
        totalPrice
      }
      createdAt
    }
  }
`;

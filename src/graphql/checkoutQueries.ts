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

// Novo: Checkout com endereço inline
export const CHECKOUT_WITH_ADDRESS = gql`
  mutation CheckoutWithAddress($input: CreateAddressInput!, $notes: String) {
    checkoutWithAddress(input: $input, notes: $notes) {
      id
      status
      totalAmount
      shippingCost
      items {
        id
        product { id title }
        quantity
        totalPrice
      }
      createdAt
    }
  }
`;

// Validar endereço de envio
export const VALIDATE_SHIPPING_ADDRESS = gql`
  mutation ValidateShippingAddress(
    $street: String!
    $number: String!
    $neighborhood: String!
    $city: String!
    $state: String!
    $cep: String!
    $complement: String
  ) {
    validateShippingAddress(
      street: $street
      number: $number
      neighborhood: $neighborhood
      city: $city
      state: $state
      cep: $cep
      complement: $complement
    ) {
      isValid
      errors {
        field
        message
      }
    }
  }
`;

// Validar informações de pagamento
export const VALIDATE_PAYMENT_INFO = gql`
  mutation ValidatePaymentInfo(
    $method: String!
    $cardNumber: String
    $cardExpiry: String
    $cardCvv: String
    $installments: Int
  ) {
    validatePaymentInfo(
      method: $method
      cardNumber: $cardNumber
      cardExpiry: $cardExpiry
      cardCvv: $cardCvv
      installments: $installments
    ) {
      isValid
      errors {
        field
        message
      }
    }
  }
`;

// Calcular frete
export const CALCULATE_SHIPPING = gql`
  mutation CalculateShipping(
    $cep: String!
    $state: String!
    $city: String!
  ) {
    calculateShipping(cep: $cep, state: $state, city: $city) {
      success
      shippingCost
      estimatedDays
      error
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

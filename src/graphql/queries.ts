import { gql } from '@apollo/client';

// Queries
export const GET_HEALTH = gql`
  query GetHealth {
    _health
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      role
      phone
      status
      createdAt
      updatedAt
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts(
    $categoryId: ID,
    $title: String,
    $artisanId: ID,
    $minPrice: Float,
    $maxPrice: Float,
    $sizes: [ID!],
    $colors: [ID!],
    $inStock: Boolean,
    $rating: Int,
    $sortField: ProductSortField,
    $sortOrder: SortOrder,
    $page: Int,
    $size: Int
  ) {
    searchProducts(
      categoryId: $categoryId,
      title: $title,
      artisanId: $artisanId,
      minPrice: $minPrice,
      maxPrice: $maxPrice,
      sizes: $sizes,
      colors: $colors,
      inStock: $inStock,
      rating: $rating,
      sortField: $sortField,
      sortOrder: $sortOrder,
      page: $page,
      size: $size
    ) {
      products {
        id
        title
        description
        price
        status
        categoryId
        artisanId
        inventory
        images {
          id
          url
          sortOrder
        }
        createdAt
        updatedAt
      }
      totalCount
      totalPages
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      description
      price
      status
      categoryId
      artisanId
      inventory
      images {
        id
        url
        sortOrder
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      parentId
    }
  }
`;

export const GET_ARTISANS = gql`
  query GetArtisans {
    artisans {
      id
      name
      email
      role
      status
    }
  }
`;

export const GET_SIZES = gql`
  query GetSizes {
    sizes {
      id
      name
      code
      sortOrder
      isActive
    }
  }
`;

export const GET_COLORS = gql`
  query GetColors {
    colors {
      id
      name
      hexCode
      sortOrder
      isActive
    }
  }
`;

export const GET_BRANDS = gql`
  query GetBrands {
    brands {
      id
      name
      description
      logoUrl
      websiteUrl
      isActive
    }
  }
`;

export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: ID!) {
    productReviews(productId: $productId) {
      id
      productId
      userId
      userName
      rating
      title
      comment
      isVerifiedPurchase
      createdAt
    }
  }
`;

export const GET_PRODUCT_RATING = gql`
  query GetProductRating($productId: ID!) {
    productRating(productId: $productId) {
      average
      count
    }
  }
`;

export const GET_MY_CART = gql`
  query GetMyCart {
    myCart {
      id
      items {
        id
        product {
          id
          title
          price
          images {
            url
          }
        }
        quantity
        totalPrice
      }
      total
      itemCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_ADDRESSES = gql`
  query GetMyAddresses {
    myAddresses {
      id
      street
      city
      state
      zipCode
      country
      primary
      createdAt
    }
  }
`;

// Mutations
export const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      token
      user {
        id
        name
        email
        role
        phone
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
        phone
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity) {
      id
      items {
        id
        product {
          id
          title
          price
          images {
            url
          }
        }
        quantity
        totalPrice
      }
      total
      itemCount
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($productId: ID!, $quantity: Int!) {
    updateCartItem(productId: $productId, quantity: $quantity) {
      id
      items {
        id
        product { id title price images { url } }
        quantity
        totalPrice
      }
      total
      itemCount
      updatedAt
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($productId: ID!) {
    removeFromCart(productId: $productId) {
      id
      items {
        id
        product { id title price images { url } }
        quantity
        totalPrice
      }
      total
      itemCount
      updatedAt
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart
  }
`;

export const CREATE_ADDRESS = gql`
  mutation CreateAddress($input: CreateAddressInput!) {
    createAddress(input: $input) {
      id
      street
      city
      state
      zipCode
      country
      primary
      createdAt
    }
  }
`;

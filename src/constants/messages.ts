/**
 * Mensagens da aplicação
 */

export const MESSAGES = {
  // Erros
  ERRORS: {
    UNAUTHORIZED: 'Você precisa fazer login para acessar este recurso',
    FORBIDDEN: 'Você não tem permissão para acessar este recurso',
    NOT_FOUND: 'Recurso não encontrado',
    VALIDATION_ERROR: 'Erro ao validar os dados',
    SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde',
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet',
    SOMETHING_WENT_WRONG: 'Algo deu errado. Tente novamente',
    INVALID_CREDENTIALS: 'Email ou senha inválidos',
    EMAIL_ALREADY_EXISTS: 'Este email já está cadastrado',
    INVALID_EMAIL: 'Email inválido',
    PASSWORD_TOO_SHORT: 'Senha deve ter pelo menos 6 caracteres',
    REQUIRED_FIELD: 'Este campo é obrigatório',
    INVALID_ADDRESS: 'Endereço inválido',
    CART_EMPTY: 'Seu carrinho está vazio',
    PRODUCT_OUT_OF_STOCK: 'Produto fora de estoque',
    ORDER_ERROR: 'Erro ao processar pedido',
    ADDRESS_ERROR: 'Erro ao gerenciar endereço',
  },

  // Sucessos
  SUCCESS: {
    LOGIN: 'Login realizado com sucesso',
    LOGOUT: 'Logout realizado com sucesso',
    REGISTER: 'Cadastro realizado com sucesso',
    PROFILE_UPDATE: 'Perfil atualizado com sucesso',
    ADDRESS_CREATED: 'Endereço adicionado com sucesso',
    ADDRESS_UPDATED: 'Endereço atualizado com sucesso',
    ADDRESS_DELETED: 'Endereço removido com sucesso',
    ADD_TO_CART: 'Produto adicionado ao carrinho',
    REMOVE_FROM_CART: 'Produto removido do carrinho',
    CART_CLEARED: 'Carrinho limpo com sucesso',
    ORDER_CREATED: 'Pedido criado com sucesso',
  },

  // Confirmações
  CONFIRMATIONS: {
    DELETE_ADDRESS: 'Tem certeza que deseja deletar este endereço?',
    DELETE_CART_ITEM: 'Tem certeza que deseja remover este item?',
    CLEAR_CART: 'Tem certeza que deseja limpar o carrinho?',
    LOGOUT: 'Tem certeza que deseja sair?',
  },

  // Informações
  INFO: {
    LOADING: 'Carregando...',
    NO_RESULTS: 'Nenhum resultado encontrado',
    NO_PRODUCTS: 'Nenhum produto disponível',
    NO_ORDERS: 'Nenhum pedido realizado',
    NO_ADDRESSES: 'Nenhum endereço cadastrado',
  },
} as const;

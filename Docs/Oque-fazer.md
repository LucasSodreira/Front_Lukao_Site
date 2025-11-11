1. Usabilidade / Experiência
Usuário perde progresso ao recarregar
Causa: estado só em memória.
Prevenção: já usamos sessionStorage; garantir versão / expiração clara e hidratação defensiva (validar objetos antes de usar).
Botão “Proceder para Pagamento” clicado múltiplas vezes
Causa: falta de desabilitar durante a mutation.
Prevenção: manter loading + disabled enquanto cria o pedido e enquanto processa pagamento; backend pode rejeitar pedidos duplicados no mesmo carrinho (hash de itens).
Formulário de endereço envia dados incompletos (ex: CEP vazio)
Causa: validação parcial só no backend.
Prevenção: validação sincrona no frontend antes de chamar validateShippingAddress; highlight de campos inválidos.
Usuário fecha o navegador entre criar ordem e pagar
Causa: orderId salvo mas carrinho limpo depois de pagamento não concluído.
Prevenção: não limpar carrinho até payment “PAID”; exibir banner de “Pedido ainda aguardando pagamento” ao reabrir; rotina de expiração de pedidos “CREATED” após X horas.
2. Consistência de Dados
Carrinho muda após criação da ordem (adiciona/remove item)
Causa: diferenças entre Order e Cart.
Prevenção: congelar carrinho (flag locked) quando pedido “CREATED” até pagamento; ou recalcular valor antes de PaymentIntent e abortar se divergente.
Preço de produto atualizado após pedido criado
Causa: mutations de catálogo.
Prevenção: copiar preço e título para OrderItem (já feito) e não recalcular; adicionar assinatura de integridade (hash) se quiser validar fraude.
Estoque reduzido por outra compra entre revisão e pagamento
Causa: concorrência.
Prevenção: reservar estoque ao criar pedido (campo reservedQuantity / decremento temporário) e liberar se expirar; ou validar estoque novamente antes de processStripePayment e cancelar pedido se indisponível.
Frete exibido diferente do frete usado no total
Causa: placeholder fixo na UI.
Prevenção: persistir shippingCost calculado em Order e sempre renderizar a partir da Order, não de um valor hardcoded.
3. Segurança / Fraude
Manipulação de preço via DevTools
Causa: confiar em valores do cliente ao criar PaymentIntent.
Prevenção: backend deve sempre calcular totalAmount com base nos dados persistidos (já faz); ignorar qualquer total enviado do cliente.
Uso de endereço que pertence a outro usuário
Causa: não checar ownership.
Prevenção: já validado em OrderService.checkout; manter testes de regressão.
Tentativa de acessar pedido de outro usuário via /checkout/success?orderId=#
Causa: falta de verificação de propriedade.
Prevenção: manter authorization no getOrder (já implementado).
4. Integração de Pagamento
PaymentIntent criado mas não confirmado (órfão)
Causa: usuário abandona etapa.
Prevenção: tarefa programada (cron) que marca PaymentIntents antigos e cancela / libera estoque; Stripe tem expiração automática.
Duplo processamento de pagamento
Causa: clique repetido ou reenvio de requisição.
Prevenção: idempotência: guardar paymentIntentId em Order; se já estiver com status PAID, ignorar nova chamada; desabilitar formulário ao enviar.
PaymentIntent não corresponde ao orderId (mistmatch)
Causa: orderId errado enviado.
Prevenção: backend valida que o paymentIntent pertence ao order (guardar intentId na Order antes de processar).
Valor do PaymentIntent difere de totalAmount
Causa: atualização de carrinho tardia.
Prevenção: comparar amount do intent com order.totalAmount antes de processStripePayment; abortar se divergente.
5. Confiabilidade / Falhas
Timeout da mutation checkout
Causa: lenta carga de dados ou lock de banco.
Prevenção: índices adequados (produtos, carrinho); timeouts configurados; retry leve no frontend com mensagem clara.
Falha temporária em validateShippingAddress
Causa: serviço externo indisponível.
Prevenção: fallback “frete padrão” + log; registrar tentativa e permitir revalidação antes do pagamento.
Sessão expirada entre revisão e pagamento
Causa: JWT expira.
Prevenção: refresh token automático antes de PaymentIntent; se falhar, redirecionar para login preservando orderId (só se segura armazenar—ou recriar).
Corrupção de sessionStorage (JSON inválido)
Causa: manipulação manual pelo usuário.
Prevenção: try/catch ao parse (já existente); se inválido, limpar e reiniciar fluxo.
6. Performance
Consulta de carrinho repetida em cada etapa (address, review, payment)
Causa: múltiplos useQuery com network-only.
Prevenção: cache control: fetchPolicy=cache-and-network + reuso de dados em contexto; invalidar só quando necessário (update, remove).
Large cart (muitos itens) causando lentidão na montagem do Order
Causa: loop de criação de OrderItem sem batch.
Prevenção: usar save cascade (já usado) + validar limite máximo de itens no carrinho (ex: 100); paginação na UI se necessário.
7. Concorrência
Dois checkouts simultâneos no mesmo carrinho (multi-tab)
Causa: usuário abre duas abas.
Prevenção: set flag “inCheckout” no Cart; se flag presente e order CREATED, bloquear nova criação e direcionar para pagamento com order existente.
Atualização de estoque durante reserva
Causa: mudança administrativa.
Prevenção: transação com lock otimista (versão) na tabela Inventory; se conflito, abortar checkout com mensagem de “estoque atualizado”.
8. Evolução / Manutenção
Campos adicionais de endereço (CEP formatado) quebram validação futura
Causa: mudança de formato sem migração.
Prevenção: normalizar CEP (remover caracteres não numéricos) antes de persistir; documentar no README.
Mudança de status incorreta (PAID -> CREATED)
Causa: transição não validada.
Prevenção: já existe isValidStatusTransition; adicionar teste de regressão automatizado.
9. Observabilidade
Dificuldade em rastrear falhas de checkout
Causa: logs incompletos.
Prevenção: adicionar correlationId (ex: orderId / userId) em cada log; métricas: contagem de checkouts iniciados vs pagos.
Mitigações resumidas por tipo
Frontend:

Desabilitar botões em loading.
Validação local de formulário + highlight.
Idempotência visual (bloqueio ao reenviar).
Reuso de dados em contexto para evitar excesso de queries.
Tratamento de sessão expirando (refresh silencioso).
Backend:

Reserva de estoque ao criar pedido.
Confirmação de consistência (order.totalAmount vs PaymentIntent amount).
Idempotência em processStripePayment.
Validação de Ownership sempre que consultar Order.
Garbage collector para pedidos CREATED antigos.
Lock otimista em Inventory (campo version).
Dados / Persistência:

Copiar snapshot de preços para OrderItem (já feito).
Persistir shippingCost calculado (já feito).
Validar integridade antes de processar pagamento.
Observabilidade:

Logging estruturado (JSON) com orderId, userId, etapa (ADDRESS_VALIDATED, ORDER_CREATED, PAYMENT_INTENT_CREATED, PAYMENT_SUCCEEDED).
Métricas (Prometheus) de abandono: pedidos CREATED sem pagamento > X minutos.
Próximos passos sugeridos (se quiser avançar)
Integrar cálculo de frete real na UI (usar shippingCost da Order após criação).
Adicionar reserva de estoque (campo reservedQuantity).
Implementar flag inCheckout no Cart para evitar duplicidade multi-tab.
Criar cron/limpeza de pedidos CREATED antigos.
Testes automatizados: checkout feliz, estoque insuficiente, pagamento duplicado, sessão expirada.
import { useEffect, useState, useCallback, useRef } from 'react';
import { environment } from '@/config/environment';
import type { Cart } from '@/types';
import { logger } from '@/utils/logger';

export const useCartRest = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false); // Previne múltiplas chamadas iniciais

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const buildAuthHeader = (): string | null => {
    // Mantém alinhado com outros serviços que usam localStorage authToken
    const token = localStorage.getItem('authToken');
    return token ? `Bearer ${token}` : null;
  };

  // Garante que o cookie XSRF-TOKEN exista antes de mutações
  const ensureCsrf = useCallback(async () => {
    const csrf = getCookie('XSRF-TOKEN');
    if (!csrf) {
      try {
        logger.debug('CSRF token não encontrado, fazendo requisição para obtê-lo...');
        await fetch(`${environment.apiUrl}/api/cart`, {
          method: 'GET',
          credentials: 'include',
        });
        const newCsrf = getCookie('XSRF-TOKEN');
        logger.debug('CSRF token após requisição:', newCsrf ? 'Obtido com sucesso' : 'Ainda não disponível');
      } catch (error) {
        logger.error('Erro ao tentar obter CSRF token:', error);
      }
    } else {
      logger.debug('CSRF token já existe');
    }
  }, []);

  const buildJsonHeaders = useCallback((): HeadersInit => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const csrf = getCookie('XSRF-TOKEN');
    if (csrf) {
      headers['X-XSRF-TOKEN'] = csrf;
      logger.debug('CSRF token adicionado ao header:', csrf);
    } else {
      logger.warn('CSRF token NÃO encontrado ao construir headers!');
    }
    const auth = buildAuthHeader();
    if (auth) headers['Authorization'] = auth;
    logger.debug('Headers construídos:', headers);
    return headers;
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const auth = buildAuthHeader();
      const resp = await fetch(`${environment.apiUrl}/api/cart`, {
        method: 'GET',
        headers: auth ? { Authorization: auth } : undefined,
        credentials: 'include',
      });
      if (!resp.ok) throw new Error('Falha ao carregar carrinho');
      const data = await resp.json() as unknown as {
        id?: string | number;
        items?: Array<{ id?: string | number; product?: { id?: string | number; title?: string; price?: string | number; images?: Array<{ id?: string | number; url?: string; sortOrder?: number }> }; quantity?: number; totalPrice?: string | number; variation?: { id?: string|number; sku?: string; size?: string; color?: string } }>;
        total?: string | number;
        itemCount?: number;
        createdAt?: string;
        updatedAt?: string;
      };
      // Normaliza o DTO retornado para o tipo Cart do app
      const normalized: Cart = {
        id: String(data.id ?? ''),
        items: (Array.isArray(data.items) ? data.items : []).map((it: { id?: string | number; product?: { id?: string | number; title?: string; price?: string | number; images?: Array<{ id?: string | number; url?: string; sortOrder?: number }> } | undefined; quantity?: number; totalPrice?: string | number; variation?: { id?: string|number; sku?: string; size?: string; color?: string } }) => ({
          id: String(it.id ?? ''),
          product: {
            id: String(it.product?.id ?? ''),
            title: it.product?.title ?? '',
            price: String(it.product?.price ?? '0'),
            images: (Array.isArray(it.product?.images) ? it.product.images : []).map((img: { id?: string | number; url?: string; sortOrder?: number; }) => ({ id: String(img.id ?? ''), url: img.url ?? '', sortOrder: img.sortOrder ?? 0 })),
          },
          quantity: it.quantity ?? 0,
          totalPrice: String(it.totalPrice ?? '0'),
          variation: it.variation ? { id: String(it.variation.id ?? ''), sku: it.variation.sku ?? '', size: it.variation.size ?? '', color: it.variation.color ?? '' } : undefined,
        })),
        total: String(data.total ?? '0'),
        itemCount: data.itemCount ?? 0,
        createdAt: data.createdAt ?? '',
        updatedAt: data.updatedAt ?? data.createdAt ?? '',
      };
      setCart(normalized);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro ao carregar carrinho';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    const currentItem = (cart?.items || []).find((it) => String(it.id) === String(itemId));
    if (!currentItem) {
      logger.error('Item não encontrado no carrinho', { itemId });
      throw new Error('Item não encontrado no carrinho');
    }
    
    const productId = currentItem.product.id;
    const variationId = currentItem?.variation?.id ? Number(currentItem.variation.id) : undefined;

    logger.debug('Atualizando quantidade do item:', { itemId, productId, quantity, variationId });

    await ensureCsrf();
    let resp = await fetch(`${environment.apiUrl}/api/cart/items`, {
      method: 'PUT',
      credentials: 'include',
      headers: buildJsonHeaders(),
      body: JSON.stringify({ productId: Number(productId), quantity, variationId }),
    });
    if (resp.status === 403) {
      logger.warn('Erro 403, tentando novamente após obter CSRF token...');
      await ensureCsrf();
      resp = await fetch(`${environment.apiUrl}/api/cart/items`, {
        method: 'PUT',
        credentials: 'include',
        headers: buildJsonHeaders(),
        body: JSON.stringify({ productId: Number(productId), quantity, variationId }),
      });
    }
    if (!resp.ok) {
      const errorText = await resp.text();
      logger.error('Erro ao atualizar quantidade:', { status: resp.status, error: errorText });
      throw new Error(`Falha ao atualizar quantidade: ${errorText}`);
    }
    await fetchCart();
  }, [cart, fetchCart, buildJsonHeaders, ensureCsrf]);

  const removeItem = useCallback(async (itemId: string) => {
    const currentItem = (cart?.items || []).find((it) => String(it.id) === String(itemId));
    if (!currentItem) {
      logger.error('Item não encontrado no carrinho', { itemId });
      throw new Error('Item não encontrado no carrinho');
    }
    
    const productId = currentItem.product.id;
    const variationId = currentItem?.variation?.id ? Number(currentItem.variation.id) : undefined;

    logger.debug('Removendo item do carrinho:', { itemId, productId, variationId });

    const url = new URL(`${environment.apiUrl}/api/cart/items/${Number(productId)}`);
    if (variationId !== undefined) url.searchParams.set('variationId', String(variationId));

    await ensureCsrf();
    let resp = await fetch(url.toString(), {
      method: 'DELETE',
      credentials: 'include',
      headers: buildJsonHeaders(),
    });
    if (resp.status === 403) {
      logger.warn('Erro 403, tentando novamente após obter CSRF token...');
      await ensureCsrf();
      resp = await fetch(url.toString(), {
        method: 'DELETE',
        credentials: 'include',
        headers: buildJsonHeaders(),
      });
    }
    if (!resp.ok) {
      const errorText = await resp.text();
      logger.error('Erro ao remover item:', { status: resp.status, error: errorText });
      throw new Error(`Falha ao remover item: ${errorText}`);
    }
    await fetchCart();
  }, [cart, fetchCart, buildJsonHeaders, ensureCsrf]);

  // Adiciona item ao carrinho (guest ou autenticado)
  const addItem = useCallback(
    async (
      product: { id: string | number },
      quantity: number,
      options?: { variationId?: number }
    ) => {
      try {
        await ensureCsrf();
        const headers = buildJsonHeaders();
        const body = { productId: Number(product.id), quantity, variationId: options?.variationId };
        
        logger.debug('Adicionando item ao carrinho:', { body, headers });
        
        let resp = await fetch(`${environment.apiUrl}/api/cart/items`, {
          method: 'POST',
          credentials: 'include',
          headers,
          body: JSON.stringify(body),
        });
        
        if (resp.status === 403) {
          logger.warn('Erro 403, tentando novamente após obter CSRF token...');
          await ensureCsrf();
          resp = await fetch(`${environment.apiUrl}/api/cart/items`, {
            method: 'POST',
            credentials: 'include',
            headers: buildJsonHeaders(),
            body: JSON.stringify(body),
          });
        }
        
        if (!resp.ok) {
          const errorText = await resp.text();
          logger.error('Erro ao adicionar item:', { status: resp.status, error: errorText });
          throw new Error(`Falha ao adicionar item ao carrinho: ${errorText}`);
        }
        
        await fetchCart();
      } catch (error) {
        logger.error('Erro ao adicionar ao carrinho', { productId: product.id, quantity, error });
        throw error;
      }
    },
    [buildJsonHeaders, fetchCart, ensureCsrf]
  );

  useEffect(() => {
    // Previne dupla execução no React StrictMode (desenvolvimento)
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchCart();
  }, [fetchCart]);

  return { cart, loading, error, fetchCart, addItem, updateQuantity, removeItem } as const;
};

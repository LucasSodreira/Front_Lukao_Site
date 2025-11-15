import { useEffect, useState, useCallback, useRef } from 'react';
import { environment } from '@/config/environment';
import type { Cart } from '@/types';

export const useCartRest = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false); // Previne múltiplas chamadas iniciais
  const csrfTokenRef = useRef<string | null>(null);

  // Garante que o token CSRF exista antes de mutações
  const ensureCsrf = useCallback(async (forceRefresh = false) => {
    // Primeiro tenta ler do cookie
    const getCsrfFromCookie = () => {
      const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
      return match ? match[1] : null;
    };

    if (!forceRefresh) {
      const cookieToken = getCsrfFromCookie();
      if (cookieToken) {
        csrfTokenRef.current = cookieToken;
        return cookieToken;
      }
      if (csrfTokenRef.current) {
        return csrfTokenRef.current;
      }
    }

    try {
      // Faz uma requisição GET para forçar o servidor a gerar o cookie CSRF
      const resp = await fetch(`${environment.apiUrl}/api/csrf-token`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!resp.ok) {
        throw new Error(`Falha ao obter token CSRF: ${resp.status}`);
      }
      // Após a requisição, o cookie XSRF-TOKEN deve estar disponível
      const cookieToken = getCsrfFromCookie();
      if (cookieToken) {
        csrfTokenRef.current = cookieToken;
        return cookieToken;
      }
      // Fallback: usa o token do JSON se o cookie não estiver disponível
      const data = (await resp.json()) as { token?: string };
      csrfTokenRef.current = data?.token ?? null;
      return csrfTokenRef.current;
    } catch {
      csrfTokenRef.current = null;
      return null;
    }
  }, []);

  const buildJsonHeaders = useCallback((): HeadersInit => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (csrfTokenRef.current) {
      headers['X-XSRF-TOKEN'] = csrfTokenRef.current;
    }
    if (cart?.integrityToken) {
      headers['X-Integrity-Token'] = cart.integrityToken;
    }
    return headers;
  }, [cart?.integrityToken]);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch(`${environment.apiUrl}/api/cart`, {
        method: 'GET',
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
      const integrityHeader = resp.headers.get('X-Integrity-Token') ?? '';
      setCart({ ...normalized, integrityToken: integrityHeader });
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
      throw new Error('Item não encontrado no carrinho');
    }

    await ensureCsrf();
    let resp = await fetch(`${environment.apiUrl}/api/cart/items/${Number(itemId)}`, {
      method: 'PUT',
      credentials: 'include',
      headers: buildJsonHeaders(),
      body: JSON.stringify({ quantity }),
    });
    if (resp.status === 403) {
      await ensureCsrf(true);
      resp = await fetch(`${environment.apiUrl}/api/cart/items/${Number(itemId)}`, {
        method: 'PUT',
        credentials: 'include',
        headers: buildJsonHeaders(),
        body: JSON.stringify({ quantity }),
      });
    }
    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Falha ao atualizar quantidade: ${errorText}`);
    }
    await fetchCart();
  }, [cart, fetchCart, buildJsonHeaders, ensureCsrf]);

  const removeItem = useCallback(async (itemId: string) => {
    const currentItem = (cart?.items || []).find((it) => String(it.id) === String(itemId));
    if (!currentItem) {
      throw new Error('Item não encontrado no carrinho');
    }

    await ensureCsrf();
    let resp = await fetch(`${environment.apiUrl}/api/cart/items/${Number(itemId)}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: buildJsonHeaders(),
    });
    if (resp.status === 403) {
      await ensureCsrf(true);
      resp = await fetch(`${environment.apiUrl}/api/cart/items/${Number(itemId)}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: buildJsonHeaders(),
      });
    }
    if (!resp.ok) {
      const errorText = await resp.text();
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
      await ensureCsrf();
      const headers = buildJsonHeaders();
      const body = { productId: Number(product.id), quantity, variationId: options?.variationId };

      let resp = await fetch(`${environment.apiUrl}/api/cart/items`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(body),
      });

      if (resp.status === 403) {
        await ensureCsrf(true);
        resp = await fetch(`${environment.apiUrl}/api/cart/items`, {
          method: 'POST',
          credentials: 'include',
          headers: buildJsonHeaders(),
          body: JSON.stringify(body),
        });
      }

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Falha ao adicionar item ao carrinho: ${errorText}`);
      }

      await fetchCart();
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

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services';
import type { Product, Category, Size, Color } from '../../../types/domain/product';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';

interface ProductVariationRow {
  tempId: string;
  sizeName: string;
  colorName: string;
  quantity: number;
}

interface FormData {
  categoryId: string;
  title: string;
  description: string;
  price: string;
}

interface ProductCreationFormProps {
  onSuccess?: (product: Product) => void;
  onError?: (error: string) => void;
}

export const ProductCreationForm: React.FC<ProductCreationFormProps> = ({ onSuccess, onError }) => {
  // Queries
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: catalogService.getCategories,
  });

  const { data: sizes = [], isLoading: sizesLoading } = useQuery<Size[]>({
    queryKey: ['sizes'],
    queryFn: catalogService.getSizes,
  });

  const { data: colors = [], isLoading: colorsLoading } = useQuery<Color[]>({
    queryKey: ['colors'],
    queryFn: catalogService.getColors,
  });

  // State
  const [formData, setFormData] = useState<FormData>({
    categoryId: '',
    title: '',
    description: '',
    price: '',
  });

  const [variations, setVariations] = useState<ProductVariationRow[]>([
    { tempId: '1', sizeName: '', colorName: '', quantity: 0 },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);

  // Validação
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoryId) newErrors.categoryId = 'Categoria é obrigatória';
    if (!formData.title?.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Preço deve ser maior que 0';

    // Validar variações
    if (variations.length === 0) {
      newErrors.variations = 'Adicione pelo menos uma variação (tamanho + cor + quantidade)';
    } else {
      variations.forEach((v, idx) => {
        if (!v.sizeName) newErrors[`variation_size_${idx}`] = 'Tamanho obrigatório';
        if (!v.colorName) newErrors[`variation_color_${idx}`] = 'Cor obrigatória';
        if (v.quantity <= 0) newErrors[`variation_qty_${idx}`] = 'Quantidade > 0';
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleVariationChange = (tempId: string, field: string, value: string | number) => {
    setVariations(prev =>
      prev.map(v =>
        v.tempId === tempId
          ? { ...v, [field]: field === 'quantity' ? parseInt(value as string) || 0 : value }
          : v
      )
    );
    const errorKey = `variation_${field}_${variations.findIndex(v => v.tempId === tempId)}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addVariationRow = () => {
    const newTempId = Math.random().toString(36).substr(2, 9);
    setVariations(prev => [
      ...prev,
      { tempId: newTempId, sizeName: '', colorName: '', quantity: 0 },
    ]);
  };

  const removeVariationRow = (tempId: string) => {
    if (variations.length > 1) {
      setVariations(prev => prev.filter(v => v.tempId !== tempId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setCreating(true);

    try {
      const product = await catalogService.createProduct({
        categoryId: formData.categoryId,
        title: formData.title,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        // @ts-expect-error - Type mismatch between ProductVariationRow and ProductVariation
        variations: variations.map(v => ({
          sizeName: v.sizeName,
          colorName: v.colorName,
          quantity: v.quantity,
        })),
      });

      onSuccess?.(product);
      // Reset form
      setFormData({ categoryId: '', title: '', description: '', price: '' });
      setVariations([{ tempId: '1', sizeName: '', colorName: '', quantity: 0 }]);
      setErrors({});
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar produto';
      onError?.(message);
      setErrors({ submit: message });
    } finally {
      setCreating(false);
    }
  };

  const isLoading = categoriesLoading || sizesLoading || colorsLoading || creating;

  return (
    <form className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 md:p-8 max-w-4xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Criar Novo Produto</h2>

      {errors.submit && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-red-700 dark:text-red-300 font-medium">
          {errors.submit}
        </div>
      )}

      <div className="mb-8 space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Informações Básicas</h3>

        <div className="space-y-2">
          <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
            Categoria *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleFormChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-lg font-inherit transition-colors ${
              errors.categoryId
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-500`}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span className="block text-xs text-red-600 dark:text-red-400 mt-1">{errors.categoryId}</span>}
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
            Título *
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleFormChange}
            placeholder="Ex: Camiseta Básica Premium"
            disabled={isLoading}
            className={errors.title ? 'border-red-500 dark:border-red-500' : ''}
          />
          {errors.title && <span className="block text-xs text-red-600 dark:text-red-400 mt-1">{errors.title}</span>}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            placeholder="Descrição do produto (opcional)"
            rows={4}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
            Preço (R$) *
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleFormChange}
            placeholder="0.00"
            disabled={isLoading}
            className={errors.price ? 'border-red-500 dark:border-red-500' : ''}
          />
          {errors.price && <span className="block text-xs text-red-600 dark:text-red-400 mt-1">{errors.price}</span>}
        </div>
      </div>

      <div className="mb-8 space-y-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Variações (Tamanho + Cor + Quantidade)</h3>
          <span className="text-xs text-gray-600 dark:text-gray-400">Crie diferentes combinações</span>
        </div>

        {errors.variations && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-300 text-sm">
            {errors.variations}
          </div>
        )}

        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="hidden md:grid grid-cols-12 gap-3 bg-gray-100 dark:bg-gray-900 p-4 font-semibold text-sm text-gray-900 dark:text-gray-100">
            <div className="col-span-4">Tamanho</div>
            <div className="col-span-4">Cor</div>
            <div className="col-span-3">Quantidade</div>
            <div className="col-span-1 text-center">Ações</div>
          </div>

          <div className="space-y-3 p-4 md:space-y-0">
            {variations.map((variation, idx) => (
              <div key={variation.tempId} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-3 md:items-start">
                <div className="md:col-span-4 space-y-1">
                  <label className="md:hidden text-xs font-semibold text-gray-600 dark:text-gray-400">Tamanho</label>
                  <select
                    value={variation.sizeName}
                    onChange={e => handleVariationChange(variation.tempId, 'sizeName', e.target.value)}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                      errors[`variation_size_${idx}`]
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } disabled:bg-gray-100 dark:disabled:bg-gray-800`}
                  >
                    <option value="">Selecione tamanho</option>
                    {sizes.map(size => (
                      <option key={size.id} value={size.name}>
                        {size.name} ({size.code})
                      </option>
                    ))}
                  </select>
                  {errors[`variation_size_${idx}`] && (
                    <span className="block text-xs text-red-600 dark:text-red-400">{errors[`variation_size_${idx}`]}</span>
                  )}
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="md:hidden text-xs font-semibold text-gray-600 dark:text-gray-400">Cor</label>
                  <select
                    value={variation.colorName}
                    onChange={e => handleVariationChange(variation.tempId, 'colorName', e.target.value)}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                      errors[`variation_color_${idx}`]
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } disabled:bg-gray-100 dark:disabled:bg-gray-800`}
                  >
                    <option value="">Selecione cor</option>
                    {colors.map(color => (
                      <option key={color.id} value={color.name}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                  {errors[`variation_color_${idx}`] && (
                    <span className="block text-xs text-red-600 dark:text-red-400">{errors[`variation_color_${idx}`]}</span>
                  )}
                </div>

                <div className="md:col-span-3 space-y-1">
                  <label className="md:hidden text-xs font-semibold text-gray-600 dark:text-gray-400">Quantidade</label>
                  <Input
                    type="number"
                    min="0"
                    value={variation.quantity}
                    onChange={e => handleVariationChange(variation.tempId, 'quantity', e.target.value)}
                    placeholder="0"
                    disabled={isLoading}
                    className={errors[`variation_qty_${idx}`] ? 'border-red-500 dark:border-red-500' : ''}
                  />
                  {errors[`variation_qty_${idx}`] && (
                    <span className="block text-xs text-red-600 dark:text-red-400">{errors[`variation_qty_${idx}`]}</span>
                  )}
                </div>

                <div className="md:col-span-1 flex md:justify-center">
                  <button
                    type="button"
                    onClick={() => removeVariationRow(variation.tempId)}
                    disabled={variations.length === 1 || isLoading}
                    className="w-full md:w-auto px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white disabled:text-gray-600 rounded-lg font-bold transition-colors disabled:cursor-not-allowed"
                    title="Remover esta variação"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={addVariationRow}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white disabled:text-gray-600 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
        >
          + Adicionar Variação
        </button>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white disabled:text-gray-600 font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          {creating ? 'Criando produto...' : 'Criar Produto'}
        </Button>
      </div>
    </form>
  );
};

export default ProductCreationForm;

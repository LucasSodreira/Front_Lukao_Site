import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '@/features/admin/components/Sidebar';
import Header from '@/features/admin/components/Header';
import AdminForm from '@/features/admin/components/AdminForm';
import type { AdminFormField } from '@/features/admin/components/AdminForm';
import ImageUpload from '@/features/admin/components/ImageUpload';
import { catalogService } from '@/services';
import { Container } from '@/ui/Container';
import type { Product } from '@/types/domain/product';

const ProductFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  // Carregar produto existente se estiver editando
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => catalogService.getProductById(id!),
    enabled: isEditMode,
  });

  // Carregar categorias para o select
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => catalogService.getCategories(),
  });

  const [formValues, setFormValues] = useState<Record<string, unknown>>({
    title: '',
    description: '',
    price: '',
    inventory: '',
    categoryId: '',
    material: '',
    careInstructions: '',
  });

  const [productImages, setProductImages] = useState<File[]>([]);

  // Atualizar valores quando carregar produto existente
  React.useEffect(() => {
    if (product) {
      setFormValues({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        inventory: product.inventory || '',
        categoryId: product.categoryId || '',
        material: product.material || '',
        careInstructions: product.careInstructions || '',
      });
    }
  }, [product]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async (data: Partial<Product>) => {
      if (isEditMode) {
        // TODO: Implementar update quando backend tiver endpoint
        throw new Error('Update não implementado ainda');
      }
      return catalogService.createProduct(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      navigate('/admin/products');
    },
    onError: (error) => {
      console.error('Erro ao salvar produto:', error);
      setErrors({ submit: 'Erro ao salvar produto. Tente novamente.' });
    },
  });

  const handleChange = (name: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    // Limpar erro do campo ao editar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formValues.title || String(formValues.title).trim() === '') {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formValues.price || Number(formValues.price) <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    if (formValues.inventory && Number(formValues.inventory) < 0) {
      newErrors.inventory = 'Estoque não pode ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const productData: Partial<Product> = {
      title: String(formValues.title),
      description: String(formValues.description || ''),
      price: Number(formValues.price),
      inventory: formValues.inventory ? Number(formValues.inventory) : undefined,
      categoryId: formValues.categoryId ? String(formValues.categoryId) : undefined,
      material: formValues.material ? String(formValues.material) : undefined,
      careInstructions: formValues.careInstructions ? String(formValues.careInstructions) : undefined,
    };

    mutation.mutate(productData);
  };

  const fields: AdminFormField[] = [
    {
      name: 'title',
      label: 'Título do Produto',
      type: 'text',
      placeholder: 'Ex: Camiseta Básica',
      required: true,
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea',
      placeholder: 'Descreva o produto...',
      rows: 4,
    },
    {
      name: 'price',
      label: 'Preço (R$)',
      type: 'number',
      placeholder: '0.00',
      required: true,
      min: 0,
      step: 0.01,
    },
    {
      name: 'inventory',
      label: 'Estoque',
      type: 'number',
      placeholder: '0',
      min: 0,
    },
    {
      name: 'categoryId',
      label: 'Categoria',
      type: 'select',
      placeholder: 'Selecione uma categoria',
      options: categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    },
    {
      name: 'material',
      label: 'Material',
      type: 'text',
      placeholder: 'Ex: 100% Algodão',
    },
    {
      name: 'careInstructions',
      label: 'Instruções de Cuidado',
      type: 'textarea',
      placeholder: 'Ex: Lavar à mão, não usar alvejante...',
      rows: 3,
    },
  ];

  if (isEditMode && isLoadingProduct) {
    return (
      <div className="relative flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 p-8">
          <Container>
            <Header />
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Container>
          <Header />

          <div className="mb-6">
            <h1 className="text-3xl font-black">
              {isEditMode ? 'Editar Produto' : 'Criar Novo Produto'}
            </h1>
            <p className="text-sm text-gray-500">
              {isEditMode
                ? 'Atualize as informações do produto'
                : 'Preencha os dados para adicionar um novo produto'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            {errors.submit && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {errors.submit}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Imagens do Produto</h3>
                <ImageUpload
                  images={productImages}
                  onImagesChange={setProductImages}
                  maxImages={5}
                  maxSizeInMB={5}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Informações do Produto</h3>
                <AdminForm
                  fields={fields}
                  values={formValues}
                  errors={errors}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  onCancel={() => navigate('/admin/products')}
                  isSubmitting={mutation.isPending}
                  submitLabel={isEditMode ? 'Atualizar' : 'Criar Produto'}
                />
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
};

export default ProductFormPage;

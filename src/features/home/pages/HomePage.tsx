import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '@/features/products/hooks/useProducts';
import type { Product } from '@/types/domain/product';

interface Banner {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  altText: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products) {
      // Pega os primeiros 4 produtos como destaque
      setFeaturedProducts(products.slice(0, 4));
    }
  }, [products]);

  const [banners] = useState<Banner[]>([
    {
      id: '1',
      title: 'Kits da Semana',
      description: 'Combinações perfeitas para o seu estilo, prontas para usar.',
      buttonText: 'Comprar Agora',
      buttonLink: '/products',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPmBfUWwkqvBC-JkgaVDk3w9N3mD3ew3w3EBa-UgseHryrAUeSIAWyW38x5hRVjk7RlwAdTgZHoVh5vj3hoGazApCYhz-NVj9rUgjdq3sQ4C7VU0h6wFR2RwmrXuKmI2LfkQFTPXIfJOHg5bEEyuED-4ADgZjATUdCC5zTvX134eitZviZrCnHluFtyhnFwAWu6rZa7MBUb17DqZpdqHlkic24kGCbp3aEYkHUBcHVTqtTzsymg7WahWr8iWiHdJZtwu-dlLF4RoY',
      altText: 'Modelo masculino vestindo um conjunto de moletom cinza em um ambiente urbano.',
    },
    {
      id: '2',
      title: 'Coleção de Verão',
      description: 'Peças leves e versáteis para os dias mais quentes.',
      buttonText: 'Ver Coleção',
      buttonLink: '/products',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuFJutGUFjeQWh5sSsG23Nq8DNgUysOVjXejDepTF6-QDfNWmUxfmlP8bqU25BSDwluwC5rcJSqaYkkv_scBBW-pBVh6v44r3SKMxBaYE0pSIlh9yCxbRivBvifLp3YUW-yk8rQ7vUMLos2Bg0G7H0i0zgyveIWDO6sbdjZYlU-o8dlT18LcBV61D64wkJN2PAJExmce79-uBqWAmfNaUo26XVnZkfnXInwzi_nerhT-ARFcK-sFJzF3rM3G3BJ_u0U0nrPorE2bs',
      altText: 'Homem na praia vestindo uma camisa de linho e bermuda, representando a coleção de verão.',
    },
    {
      id: '3',
      title: 'Novos Acessórios',
      description: 'Complete seu visual com os detalhes que fazem a diferença.',
      buttonText: 'Ver Acessórios',
      buttonLink: '/products',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAidZOwAZkitN5nM-wpzLQxuy0P8UYwYmwg6XjNEYzOY0ZPy-yY1gu_OZLxbrRwnWzOGtehpMJEW_YpW8NzsxAJh88DOsP0lQ6l0LU3avgogtJpESSI3fOGqSY0krosYlMvNTwySntCTQKB3b7K6Q4gdOUrofyp-3BqkZIIMAbwrwbWaTOY8decVbGxq0seqO3VSTTWnhwoBGF6dgiP6tGtuxAoj5Q-gmlNBQjlkwtk74CoQqumDN9vl32qYhJG8TnlYQewbYf3214',
      altText: 'Close-up de diversos acessórios masculinos como relógio, óculos de sol e cinto de couro.',
    }
  ]);

  const handleBannerClick = (link: string) => {
    navigate(link);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    console.log('Newsletter subscription:', email);
    alert('Obrigado pela inscrição!');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="w-full">
      {/* Banners Carousel */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-full items-stretch p-1 gap-6 md:gap-8">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="relative flex h-auto flex-1 flex-col rounded-xl bg-white dark:bg-gray-800 min-w-[300px] sm:min-w-[400px] md:min-w-[500px] aspect-[4/3] overflow-hidden group cursor-pointer"
                  onClick={() => handleBannerClick(banner.buttonLink)}
                >
                  <div
                    className="absolute inset-0 bg-center bg-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    style={{ backgroundImage: `url("${banner.image}")` }}
                    title={banner.altText}
                  />
                  <div className="relative flex flex-col flex-1 justify-end p-6 md:p-8 bg-gradient-to-t from-black/60 to-transparent text-white">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{banner.title}</h2>
                      <p className="text-base font-normal mt-2 max-w-md text-slate-200">{banner.description}</p>
                    </div>
                    <button className="flex mt-6 w-fit min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-white text-black text-sm font-bold tracking-wide hover:bg-slate-200 transition-colors">
                      <span className="truncate">{banner.buttonText}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="flex justify-between items-center pb-8">
            <h2 className="text-3xl font-bold tracking-tight">Novidades</h2>
            <Link
              to="/products"
              className="flex items-center gap-2 text-sm font-medium tracking-wide text-gray-800 dark:text-white hover:text-primary transition-colors group"
            >
              <span>Ver tudo</span>
              <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1 text-base">arrow_forward</span>
            </Link>
          </div>
          {isLoading && <div className="text-center">Carregando produtos...</div>}
          {error && <div className="text-center text-red-500">Ocorreu um erro ao carregar os produtos.</div>}
          {featuredProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 group cursor-pointer"
                  onClick={() => handleProductClick(product.id.toString())}
                >
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                    style={{
                      backgroundImage: `url("${product.images?.[0]?.url || ''}")`,
                    }}
                    title={product.images?.[0]?.altText}
                  />
                  <div className="flex flex-col items-start">
                    <h3 className="text-base font-semibold leading-snug hover:text-primary transition-colors">{product.title}</h3>
                    <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400 mt-1">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Junte-se ao nosso clube</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
              Fique por dentro das últimas tendências, novidades e ofertas exclusivas. Inscreva-se na nossa newsletter.
            </p>
            <form className="flex max-w-md mx-auto mt-8" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                name="email"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-none rounded-full text-gray-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary/50 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 px-6 text-base font-normal leading-normal"
                placeholder="Seu melhor e-mail"
                required
              />
              <button
                type="submit"
                className="flex min-w-[100px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-l-none rounded-full h-12 px-6 bg-primary text-white text-sm font-bold tracking-wide hover:bg-primary/90 transition-colors"
              >
                <span className="truncate">Inscrever</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    );
  };

export default HomePage;

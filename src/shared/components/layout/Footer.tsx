import { Link } from 'react-router-dom';
import { Container } from '@/ui/Container';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 mt-12 border-t border-gray-200 dark:border-gray-700">
      <Container className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-bold text-lg mb-4">THREADS</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Estilo e sofisticação para o homem moderno.</p>
          </div>

          {/* Loja */}
          <div>
            <h3 className="font-semibold mb-4">Loja</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link to="/products" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Novidades
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Roupas
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Acessórios
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Promoções
                </a>
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="font-semibold mb-4">Institucional</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <a href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Trabalhe Conosco
                </a>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <a href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Trocas e Devoluções
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="font-semibold mb-4">Siga-nos</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors text-gray-500 dark:text-gray-400 text-sm font-medium">
                Facebook
              </a>
              <a href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors text-gray-500 dark:text-gray-400 text-sm font-medium">
                Instagram
              </a>
              <a href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors text-gray-500 dark:text-gray-400 text-sm font-medium">
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Threads. Todos os direitos reservados.</p>
          <p className="mt-4 sm:mt-0">Design & Development</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

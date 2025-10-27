import { Container } from '@/ui/Container';

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
      <Container className="py-6 text-sm text-gray-600 dark:text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>&copy; {new Date().getFullYear()} Moda & Acessórios</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-gray-900 dark:hover:text-white" href="#">Termos</a>
          <a className="hover:text-gray-900 dark:hover:text-white" href="#">Privacidade</a>
          <a className="hover:text-gray-900 dark:hover:text-white" href="#">Contato</a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

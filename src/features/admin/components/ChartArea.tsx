import React from 'react';

const ChartArea: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border-light dark:border-border-dark p-6 bg-card-light dark:bg-card-dark">
      <p className="text-text-light-primary dark:text-text-dark-primary text-lg font-semibold leading-normal">Desempenho de Vendas</p>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <p className="text-text-light-primary dark:text-text-dark-primary tracking-tight text-4xl font-bold leading-tight truncate">R$ 38.420,00</p>
        <div className="flex gap-1">
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal">Últimos 30 dias</p>
          <p className="text-[#07883b] text-sm font-medium leading-normal">+12.5%</p>
        </div>
      </div>

      <div className="flex min-h-[280px] flex-1 flex-col justify-end pt-4">
        <svg className="h-full w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 475 150" width="100%" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z" fill="url(#paint0_linear_chart)"></path>
          <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#195de6" strokeLinecap="round" strokeWidth="3"></path>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_chart" x1="236" x2="236" y1="1" y2="149">
              <stop stopColor="#195de6" stopOpacity="0.2"></stop>
              <stop offset="1" stopColor="#195de6" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>

        <div className="flex justify-around mt-2">
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs font-semibold tracking-wide">Sem 1</p>
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs font-semibold tracking-wide">Sem 2</p>
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs font-semibold tracking-wide">Sem 3</p>
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs font-semibold tracking-wide">Sem 4</p>
        </div>
      </div>
    </div>
  );
};

export default ChartArea;

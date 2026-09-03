import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);

  return (
    <div className="relative z-10 h-screen">
      <h1 className="bg-cyan-400 p-4">Vite + React</h1>
      <img src="/images/test.jpg" width={300} />
      <div className="bg-slate-400">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and {}save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      <Button variant="outline">{t('title')}</Button>
    </div>
  );
};

export default HomePage;

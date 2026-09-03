import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const BlogPage = () => {
  const { t } = useTranslation();

  return (
    <div className="card bg-slate-400 p-5">
      <h1 className="m-5 bg-cyan-400 p-4">{t('title')}</h1>
      The Dev-Blog will be here.
      <p className="read-the-docs">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores minus vel temporibus
        tenetur eos est quae in adipisci, consequuntur cum, qui similique voluptate at? Molestias
        iste placeat numquam debitis in?
      </p>
      <Button variant="outline">Button</Button>
    </div>
  );
};

export default BlogPage;

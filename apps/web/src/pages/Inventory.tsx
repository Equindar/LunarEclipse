import InventoryWidget from '@/components/inventory/InventoryWidget';
import ModeFrame from '@/components/ui/mode-frame';
import { useTranslation } from 'react-i18next';

const Inventory = () => {
  const { t } = useTranslation();

  return (
    <>
      <ModeFrame name="Demo" description="current state of development" />
      <div className="z-10 flex h-screen items-center justify-center p-10 blur-none">
        <InventoryWidget />
      </div>
    </>
  );
};

export default Inventory;

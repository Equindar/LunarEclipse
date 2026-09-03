import i18n from '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import { ModeToggle } from '../ModeToggle.js';

const lngs: Record<string, { nativeName: string }> = {
  en: { nativeName: 'English' },
  de: { nativeName: 'Deutsch' },
};

const DevControls = () => {
  const { t } = useTranslation();

  return (
    <div className="absolute right-0 top-0 z-20 m-5 p-1">
      <div>
        {Object.keys(lngs).map((lng) => (
          <button
            key={lng}
            style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }}
            type="submit"
            onClick={() => {
              i18n.changeLanguage(lng);
            }}
          >
            {lngs[lng].nativeName}
          </button>
        ))}
      </div>

      <ModeToggle />
    </div>
  );
};

export default DevControls;

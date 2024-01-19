import { useTranslation } from '@/lib/i18n';
import { fallbackLng, languages } from '@/lib/i18n/settings';
import { Logger } from '@/lib/log/Logger';
import { Trans } from 'react-i18next/TransWithoutContext';
import { Test } from '../ui/components/Test';

interface PageProps {
    params: {
        lng: string;
    };
}

export default async function Page({ params: { lng } }: PageProps) {
    const log = new Logger({ name: 'Application' });
    if (languages.indexOf(lng) < 0) lng = fallbackLng;
    const { t } = await useTranslation(lng);

    return (
        <>
            <main>
                <Test params={{ lng }} />
                <h2>
                    <Trans t={t} i18nKey="welcome">
                        Welcome to Next.js v13 <small>appDir</small> and i18next
                    </Trans>
                </h2>
                <hr style={{ marginTop: 20, width: '90%' }} />
                <div>...</div>
            </main>
        </>
    );
}

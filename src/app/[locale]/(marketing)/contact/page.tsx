import { Metadata } from 'next';
import { getSEOConfig } from '@/core/seo/config';
import { generateBaseMetadata } from '@/core/seo/metadata/base';
import { generateBreadcrumbSchema } from '@/core/seo/structured-data/breadcrumb';
import { getTranslations } from 'next-intl/server';

import { ContactForm, ContactHero } from '@/components/features/contact';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'contact.meta' });
  const config = getSEOConfig(locale);

  // Generate base metadata with canonical URL and hreflang tags
  const metadata = generateBaseMetadata(
    {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
    locale,
    '/contact',
  );

  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    {
      name: locale === 'vi' ? 'Trang chủ' : 'Home',
      url: `${config.siteUrl}/${locale}`,
    },
    {
      name: locale === 'vi' ? 'Liên hệ' : 'Contact',
      url: `${config.siteUrl}/${locale}/contact`,
    },
  ]);

  return {
    ...metadata,
    other: {
      'script:ld+json': JSON.stringify(breadcrumbSchema),
    },
  };
}

export default function ContactPage() {
  return (
    <div className="flex w-full flex-col">
      <ContactHero />

      <section className="pt-12 md:pt-16 lg:pt-20">
        <ContactForm />
      </section>
    </div>
  );
}

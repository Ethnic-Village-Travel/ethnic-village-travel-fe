import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import Container from '@/components/ui/container';
import { ContactForm, ContactHero, ContactInfo } from '@/components/features/contact';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'contact.meta' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ContactPage() {
  return (
    <div className="flex w-full flex-col">
      <ContactHero />

      <section className="py-12 md:py-16 lg:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="order-2 lg:order-1">
              <ContactForm />
            </div>
            <div className="order-1 lg:order-2">
              <ContactInfo />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

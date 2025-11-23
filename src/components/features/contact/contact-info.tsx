'use client';

import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';

export function ContactInfo() {
  const t = useTranslations('contact.info');
  const tContact = useTranslations('contact');

  const contactItems = [
    {
      icon: Phone,
      title: t('phone.title'),
      content: [t('phone.primary'), t('phone.secondary')],
      link: `tel:${t('phone.primary')}`,
    },
    {
      icon: Mail,
      title: t('email.title'),
      content: [t('email.general'), t('email.support')],
      link: `mailto:${t('email.general')}`,
    },
    {
      icon: MapPin,
      title: t('address.title'),
      content: [t('address.line1'), t('address.line2')],
    },
    {
      icon: Clock,
      title: t('hours.title'),
      content: [t('hours.weekdays'), t('hours.weekend')],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dark">{t('title')}</h2>
      </div>

      <div className="space-y-4">
        {contactItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="p-6 transition-shadow hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-primary-500/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="h-6 w-6 text-primary-500" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 font-semibold text-dark">{item.title}</h3>
                  <div className="space-y-1">
                    {item.content.map((line, idx) => (
                      <p key={idx} className="text-sm text-gray-600">
                        {item.link && idx === 0 ? (
                          <a href={item.link} className="transition-colors hover:text-primary-500">
                            {line}
                          </a>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="bg-primary-500/5 border-primary-500/20 p-6">
        <p className="text-center text-sm text-gray-600">{tContact('response_time')}</p>
      </Card>
    </div>
  );
}

import { redirect } from 'next/navigation';

import { AppConfig } from '@/utils/config';

export default function RootPage() {
  redirect(`/${AppConfig.defaultLocale}`);
}
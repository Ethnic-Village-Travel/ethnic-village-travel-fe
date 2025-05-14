'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Card</CardTitle>
        <CardDescription>Card description with muted foreground color</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This card demonstrates the card background and foreground colors, with content showing regular text.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">Cancel</Button>
        <Button>Continue</Button>
      </CardFooter>
    </Card>
  );
}

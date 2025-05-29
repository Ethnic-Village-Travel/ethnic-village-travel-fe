import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

export default function AdditionalInformationCard() {
  const [content, setContent] = useState<string>('');

  return (
    <Card className="rounded-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 py-3">
        <CardTitle className="text-xl">Additional requirements (optional)</CardTitle>
      </CardHeader>
      <Separator className="h-px w-full bg-gray-20" />
      <CardContent className="px-5 py-3">
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn..."
          className="focus-visible:ring-none h-28 resize-none border-primary-500 focus-visible:ring-0"
        />
        <p className="mt-2 text-xs font-bold text-gray-500">
          Format: English or local language at destination. Requirements subject to actual situation of the supplier.
        </p>
      </CardContent>
    </Card>
  );
}

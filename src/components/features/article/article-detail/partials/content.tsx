import { Article } from '@/types/article.type';
import { Card, CardContent } from '@/components/ui/card';

interface ArticleDetailContentProps {
  article: Article;
}

export default function ArticleDetailContent({ article }: ArticleDetailContentProps) {
  const { content } = article;

  return (
    <Card className="border-none bg-card/80 shadow-none">
      <CardContent className="prose prose-neutral prose-headings:mt-8 prose-headings:mb-4 prose-p:mb-4 prose-li:mb-1 max-w-none p-0 py-8 text-base leading-relaxed">
        <article
          className="space-y-4"
          dangerouslySetInnerHTML={{
            __html: content || '',
          }}
        />
      </CardContent>
    </Card>
  );
}

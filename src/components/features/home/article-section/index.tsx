import Link from 'next/link';
import { RouteConstant } from '@/core/constants/route';
import { MOCK_ARTICLES } from '@/data/articles';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import TitleSection from '../title-section';
import ArticleList from './article-list';

const ArticleSection = () => {
  const t = useTranslations('common');
  return (
    <section className="flex flex-col items-center gap-6">
      <TitleSection
        title="✈️ Travel Vibes – Feel Every Journey"
        description="Stories, tips & inspo for every wanderer at heart 🌎💫"
      />
      <ArticleList articles={MOCK_ARTICLES} />
      <Button asChild>
        <Link href={`${RouteConstant.article}`}>
          {t('view_more')}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </section>
  );
};

export default ArticleSection;

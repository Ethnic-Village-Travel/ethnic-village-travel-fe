import Link from 'next/link';
import { RouteConstant } from '@/constants/route';
import { MOCK_ARTICLES } from '@/data/articles';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import TitleSection from '../title-section';
import ArticleList from './article-list';

const ArticleSection = () => {
  return (
    <section className="flex flex-col items-center gap-6">
      <TitleSection
        title="✈️ Travel Vibes – Feel Every Journey"
        description="Stories, tips & inspo for every wanderer at heart 🌎💫"
      />
      <ArticleList articles={MOCK_ARTICLES} />
      <Button asChild>
        <Link href={`${RouteConstant.article}`}>
          Xem thêm
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </section>
  );
};

export default ArticleSection;

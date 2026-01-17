import ArticleEditContent from '@/components/features/admin/article-management/article-edit';

type AdminArticleEditPageProps = {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminArticleEditPage(props: AdminArticleEditPageProps) {
  const params = await props.params;
  return <ArticleEditContent id={params.id} />;
}

interface ArticleDetailPageProps {
  params: { slug: string };
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = params;

  return (
    <main>
      <h1 className="text-2xl font-bold">{slug}</h1>
    </main>
  );
}

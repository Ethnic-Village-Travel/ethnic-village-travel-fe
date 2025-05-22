'use client';

import ArticleItem, { ArticleItemProps } from '@/components/features/article/article-item';
import ArticleList from '@/components/features/article/article-list';

const MOCK_ARTICLES: ArticleItemProps[] = [
  {
    id: '1',
    title: 'Các nguồn tài nguyên hữu ích cho 1 front-end developer',
    author: 'Doan Tran',
    readTime: 12,
    slug: 'cac-nguon-tai-nguyen-huu-ich-cho-1-front-end-developer',
    thumbnailUrl: '/images/blog/blog-card-thumbnail.png',
    tags: ['Front-end', 'Development', 'Resources'],
    description:
      'Tổng hợp các nguồn tài nguyên hữu ích dành cho front-end developer từ các thư viện, framework cho đến các công cụ thiết kế và tài liệu tham khảo.',
    date: '15 Tháng 6, 2023',
  },
  {
    id: '2',
    title: 'Khám phá vẻ đẹp văn hóa dân tộc vùng cao Tây Bắc',
    author: 'Minh Anh',
    readTime: 8,
    slug: 'kham-pha-ve-dep-van-hoa-dan-toc-vung-cao-tay-bac',
    tags: ['Du lịch', 'Văn hóa', 'Tây Bắc'],
    description:
      'Hành trình khám phá vẻ đẹp văn hóa đặc sắc của các dân tộc vùng cao Tây Bắc, từ phong tục tập quán đến lễ hội truyền thống và ẩm thực đặc trưng.',
    date: '03 Tháng 5, 2023',
  },
  {
    id: '3',
    title: 'Ẩm thực đặc trưng của các dân tộc thiểu số Việt Nam',
    author: 'Thu Hà',
    readTime: 15,
    slug: 'am-thuc-dac-trung-cua-cac-dan-toc-thieu-so-viet-nam',
    tags: ['Ẩm thực', 'Văn hóa', 'Dân tộc'],
    description:
      'Khám phá nét đặc sắc trong ẩm thực của các dân tộc thiểu số Việt Nam, những món ăn truyền thống và bí quyết chế biến được lưu truyền qua nhiều thế hệ.',
    date: '21 Tháng 4, 2023',
  },
  {
    id: '4',
    title: 'Những điểm du lịch văn hóa bạn nên ghé thăm trong năm 2023',
    author: 'Quang Dũng',
    readTime: 10,
    slug: 'nhung-diem-du-lich-van-hoa-ban-nen-ghe-tham-trong-nam-2023',
    tags: ['Du lịch', 'Văn hóa', '2023'],
    description:
      'Gợi ý các điểm đến du lịch văn hóa nổi bật tại Việt Nam trong năm 2023, từ các làng nghề truyền thống đến các lễ hội đặc sắc và khu bảo tồn văn hóa.',
    date: '10 Tháng 3, 2023',
  },
];

export default function ArticlesPage() {
  return (
    <>
      <section className="mb-12">
        <h2 className="mb-8 text-2xl font-bold">Bài viết đáng chú ý</h2>
        <div className="space-y-6">
          {MOCK_ARTICLES.map(article => (
            <ArticleItem key={article.id} {...article} variant="horizontal" className="max-w-full" />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-8 text-2xl font-bold">Bài viết mới nhất</h2>
        <ArticleList articles={MOCK_ARTICLES} />
      </section>
    </>
  );
}

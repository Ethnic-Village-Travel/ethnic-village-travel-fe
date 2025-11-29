import { useTranslations } from 'next-intl';

const GuildProfileCard = () => {
  const t = useTranslations('tour.detail.guild_profile');
  const data = {
    name: 'Nguyễn Văn A',
    experience: 10,
    language: ['Tiếng Việt', 'Tiếng Anh'],
    achievements: ['Hướng dẫn viên xuất sắc', 'Hướng dẫn viên nổi tiếng'],
    description: t('description'),
  };

  return (
    <div className="flex w-full flex-col gap-2 rounded-[20px] border border-gray-20 bg-white p-5 shadow-custom-gray sm:p-[30px] xl:w-[360px]">
      <div className="flex gap-4">
        <img
          src="/images/tour-card-thumbnail.png"
          alt="Guild Profile Card"
          className="h-[120px] w-[100px] flex-shrink-0 rounded-lg object-cover sm:h-[148px] sm:w-[120px]"
        />
        <div className="text-dark-500 text-sm">
          <p className="text-base font-bold sm:text-lg">{data.name}</p>
          <p>{t('experience', { years: data.experience })}</p>
          <p>
            {t('languages')}: {data.language.join(', ')}
          </p>
          <p>
            {t('achievements')}: {data.achievements.join(', ')}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-500 sm:text-base">{data.description}</p>
    </div>
  );
};

export default GuildProfileCard;

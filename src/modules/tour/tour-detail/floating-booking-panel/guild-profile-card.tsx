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
    <div className="flex flex-col gap-2 rounded-[20px] border border-gray-20 bg-white p-[30px] shadow-custom-gray lg:max-w-[360px]">
      <div className="flex gap-4 sm:flex-col sm:items-center md:flex-col md:items-center lg:flex-col lg:items-center xl:flex-row">
        <img
          src="/images/tour-card-thumbnail.png"
          alt="Guild Profile Card"
          className="h-[148px] w-[120px] rounded-lg"
        />
        <div className="text-dark-500 text-sm">
          <p className="text-lg font-bold">{data.name}</p>
          <p>{t('experience', { years: data.experience })}</p>
          <p>
            {t('languages')}: {data.language.map(lang => lang).join(', ')}
          </p>
          <p>
            {t('achievements')}: {data.achievements.map(achievement => achievement).join(', ')}
          </p>
        </div>
      </div>
      <p className="text-base text-gray-500">{data.description}</p>
    </div>
  );
};

export default GuildProfileCard;

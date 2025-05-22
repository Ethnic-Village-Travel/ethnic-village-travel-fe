import ReasonCard from './reason-card';

const ReasonList = () => {
  const reasons = [
    {
      icon: 'reason-icon.png',
      title: 'Đáp ứng mọi nhu cầu của bạn',
      description:
        'Từ chuyến bay, chỗ ở đến các điểm tham quan, bạn có thể tin tưởng vào sản phẩm và Hướng dẫn Du lịch đầy đủ của chúng tôi.',
    },
    {
      icon: 'reason-icon.png',
      title: 'Giá cả hợp lý',
      description:
        'Chúng tôi cam kết mang đến cho bạn những trải nghiệm du lịch tuyệt vời với mức giá phải chăng nhất.',
    },
    {
      icon: 'reason-icon.png',
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn mọi lúc, mọi nơi trong suốt chuyến đi.',
    },
  ];

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
      {reasons.map((reason, index) => (
        <ReasonCard key={index} icon={reason.icon} title={reason.title} description={reason.description} />
      ))}
    </div>
  );
};

export default ReasonList;

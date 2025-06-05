import { Separator } from '@/components/ui/separator';

const FooterCopyright: React.FC = () => {
  return (
    <>
      <Separator className="bg-[#D9E1E1]" />
      <div className="py-3 text-center">
        <p className="text-base font-bold md:text-lg">©2023 Travo All Rights are reserved️</p>
      </div>
    </>
  );
};

export default FooterCopyright;

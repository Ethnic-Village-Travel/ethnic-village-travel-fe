import Link from 'next/link';

interface FooterLinkGroupProps {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

const FooterLinkGroup: React.FC<FooterLinkGroupProps> = ({ title, links }) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold md:text-xl lg:text-2xl">{title}</h3>
      <ul className="flex flex-col gap-2">
        {links.map((link, index) => (
          <li key={`${title}-${index}`}>
            <Link href={link.href} className="text-sm hover:underline md:text-base">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FooterNavLinks: React.FC = () => {
  const aboutUsLinks = [
    { label: 'Our Story', href: '#' },
    { label: 'Team', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Testimonials', href: '#' },
    { label: 'Partners', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Blog', href: '#' },
  ];

  const supportLinks = [
    { label: 'Help Center', href: '#' },
    { label: 'Safety Information', href: '#' },
    { label: 'Cancellation Options', href: '#' },
    { label: 'COVID-19 Response', href: '#' },
    { label: 'Accessibility', href: '#' },
    { label: 'Report Issue', href: '#' },
  ];

  const destinationLinks = [
    { label: 'Ha Giang', href: '#' },
    { label: 'Sapa', href: '#' },
    { label: 'Mu Cang Chai', href: '#' },
    { label: 'Mai Chau', href: '#' },
    { label: 'Ba Be', href: '#' },
    { label: 'Kon Tum', href: '#' },
    { label: 'Dak Nong', href: '#' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8 lg:gap-16">
      <FooterLinkGroup title="About Us" links={aboutUsLinks} />
      <FooterLinkGroup title="Support" links={supportLinks} />
      <FooterLinkGroup title="Destinations" links={destinationLinks} />
    </div>
  );
};

export default FooterNavLinks;

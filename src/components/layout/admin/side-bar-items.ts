import { PermissionMap } from '@/constants/permission-map';
import { RouteConstant } from '@/constants/route';
import { Bell, Book, FileText, LayoutGrid, MapPin, MessageCircle, ShieldCheck, ShoppingCart, User } from 'lucide-react';

export type SIDEBAR_NAV_ITEM_PROP = {
  label: string;
  icon: React.ElementType;
  href: string;
  permission: string[];
};

export const SIDEBAR_NAV_ITEMS: Record<string, SIDEBAR_NAV_ITEM_PROP[]> = {
  'section.general': [
    {
      label: 'dashboard',
      icon: LayoutGrid,
      href: RouteConstant.admin_dashboard,
      permission: PermissionMap[RouteConstant.admin_dashboard],
    },
    {
      label: 'user',
      icon: User,
      href: RouteConstant.admin_user,
      permission: PermissionMap[RouteConstant.admin_user],
    },
    {
      label: 'role',
      icon: ShieldCheck,
      href: RouteConstant.admin_role,
      permission: PermissionMap[RouteConstant.admin_role],
    },
  ],
  'section.functions': [
    {
      label: 'tour',
      icon: MapPin,
      href: RouteConstant.admin_tour,
      permission: PermissionMap[RouteConstant.admin_tour],
    },
    {
      label: 'order',
      icon: ShoppingCart,
      href: RouteConstant.admin_order,
      permission: PermissionMap[RouteConstant.admin_order],
    },
    {
      label: 'article',
      icon: Book,
      href: RouteConstant.admin_article,
      permission: PermissionMap[RouteConstant.admin_article],
    },
    {
      label: 'notification',
      icon: Bell,
      href: RouteConstant.admin_notification,
      permission: PermissionMap[RouteConstant.admin_notification],
    },
    {
      label: 'report',
      icon: FileText,
      href: RouteConstant.admin_report,
      permission: PermissionMap[RouteConstant.admin_report],
    },
    {
      label: 'chatbot',
      icon: MessageCircle,
      href: RouteConstant.admin_chatbot,
      permission: PermissionMap[RouteConstant.admin_chatbot],
    },
  ],
} as const;

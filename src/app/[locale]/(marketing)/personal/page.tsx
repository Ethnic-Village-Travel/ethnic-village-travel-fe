import { redirect } from 'next/navigation';

export default function PersonalPage() {
  // Redirect to account page as default
  redirect('/personal/account');
}

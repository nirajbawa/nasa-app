import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to signup page
  redirect('/signup');
}

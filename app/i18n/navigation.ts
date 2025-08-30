import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

export const {
  Link,       // localized <Link>
  redirect,   // localized redirect
  usePathname,
  useRouter
} = createNavigation(routing);

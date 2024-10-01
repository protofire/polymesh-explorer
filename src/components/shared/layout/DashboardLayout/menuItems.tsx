import DescriptionIcon from '@mui/icons-material/Description';
import { ROUTES } from '@/config/routes';

export const MENU_NAVIGATION = [
  {
    segment: ROUTES.Home,
    title: 'Home',
    icon: <DescriptionIcon />,
  },
  {
    segment: ROUTES.Identity.substring(1),
    title: 'Identities',
    icon: <DescriptionIcon />,
  },
  {
    segment: ROUTES.Asset.substring(1),
    title: 'Assets',
    icon: <DescriptionIcon />,
  },
  {
    segment: ROUTES.Venue.substring(1),
    title: 'Venue',
    icon: <DescriptionIcon />,
  },
];

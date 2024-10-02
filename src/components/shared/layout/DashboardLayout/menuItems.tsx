import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import TollIcon from '@mui/icons-material/Toll';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import { ROUTES } from '@/config/routes';

export const MENU_NAVIGATION = [
  {
    segment: ROUTES.Home,
    title: 'Home',
    icon: <HomeIcon />,
  },
  {
    segment: ROUTES.Identity.substring(1),
    title: 'Identities',
    icon: <RecentActorsIcon />,
  },
  {
    segment: ROUTES.Asset.substring(1),
    title: 'Assets',
    icon: <TollIcon />,
  },
  {
    segment: ROUTES.Venue.substring(1),
    title: 'Venue',
    icon: <DescriptionIcon />,
  },
];

/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */

'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Link, styled, useTheme, type Theme } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import type {} from '@mui/material/themeCssVarsAugmentation';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Navigation } from '@toolpad/core/AppProvider';
import { AccountProps } from '@toolpad/core/Account';
import { ToolbarActions } from '@toolpad/core/DashboardLayout';
import Image from 'next/image';
import NextLink from 'next/link';

import {
  getItemTitle,
  getPageItemFullPath,
  isPageItemSelected,
} from './navigation';
import { MENU_NAVIGATION } from './menuItems';

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  borderWidth: 0,
  borderBottomWidth: 1,
  borderStyle: 'solid',
  borderColor: (theme.vars ?? theme).palette.divider,
  boxShadow: 'none',
  // TODO: Temporary fix to issue reported in https://github.com/mui/material-ui/issues/43244
  left: 0,
  zIndex: theme.zIndex.drawer + 1,
}));

const LogoContainer = styled('div')({
  position: 'relative',
  height: 40,
  '& img': {
    maxHeight: 40,
  },
});

const getDrawerSxTransitionMixin = (isExpanded: boolean, property: string) => ({
  transition: (theme: Theme) =>
    theme.transitions.create(property, {
      easing: theme.transitions.easing.sharp,
      duration: isExpanded
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen,
    }),
});

const getDrawerWidthTransitionMixin = (isExpanded: boolean) => ({
  ...getDrawerSxTransitionMixin(isExpanded, 'width'),
  overflowX: 'hidden',
});

const NavigationListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 8,
  '&.Mui-selected': {
    '& .MuiListItemIcon-root': {
      color: (theme.vars ?? theme).palette.primary.dark,
    },
    '& .MuiTypography-root': {
      color: (theme.vars ?? theme).palette.primary.dark,
    },
    '& .MuiSvgIcon-root': {
      color: (theme.vars ?? theme).palette.primary.dark,
    },
    '& .MuiAvatar-root': {
      backgroundColor: (theme.vars ?? theme).palette.primary.dark,
    },
    '& .MuiTouchRipple-child': {
      backgroundColor: (theme.vars ?? theme).palette.primary.dark,
    },
  },
  '& .MuiSvgIcon-root': {
    color: (theme.vars ?? theme).palette.action.active,
  },
  '& .MuiAvatar-root': {
    backgroundColor: (theme.vars ?? theme).palette.action.active,
  },
}));

interface DashboardSidebarSubNavigationProps {
  subNavigation: Navigation;
  basePath?: string;
  depth?: number;
  onLinkClick: () => void;
  isMini?: boolean;
  isFullyExpanded?: boolean;
  hasDrawerTransitions?: boolean;
  selectedItemId: string;
}

function DashboardSidebarSubNavigation({
  subNavigation,
  basePath = '',
  depth = 0,
  onLinkClick,
  isMini = false,
  isFullyExpanded = true,
  hasDrawerTransitions = false,
  selectedItemId,
}: DashboardSidebarSubNavigationProps) {
  const pathname = usePathname() ?? '/';
  const initialExpandedSidebarItemIds = React.useMemo(
    () =>
      subNavigation
        .map((navigationItem, navigationItemIndex) => ({
          navigationItem,
          originalIndex: navigationItemIndex,
        }))
        .map(({ originalIndex }) => `${depth}-${originalIndex}`),
    [depth, subNavigation],
  );

  const [expandedSidebarItemIds, setExpandedSidebarItemIds] = React.useState(
    initialExpandedSidebarItemIds,
  );

  const handleOpenFolderClick = React.useCallback(
    (itemId: string) => () => {
      setExpandedSidebarItemIds((previousValue) =>
        previousValue.includes(itemId)
          ? previousValue.filter(
              (previousValueItemId) => previousValueItemId !== itemId,
            )
          : [...previousValue, itemId],
      );
    },
    [],
  );

  return (
    <List sx={{ padding: 0, mb: depth === 0 ? 4 : 1, pl: 2 * depth }}>
      {subNavigation.map((navigationItem, navigationItemIndex) => {
        if (navigationItem.kind === 'header') {
          return (
            <ListSubheader
              // eslint-disable-next-line react/no-array-index-key
              key={`subheader-${depth}-${navigationItemIndex}`}
              component="div"
              sx={{
                fontSize: 12,
                fontWeight: '700',
                height: isMini ? 0 : 40,
                ...(hasDrawerTransitions
                  ? getDrawerSxTransitionMixin(isFullyExpanded, 'height')
                  : {}),
                px: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {getItemTitle(navigationItem)}
            </ListSubheader>
          );
        }

        if (navigationItem.kind === 'divider') {
          const nextItem = subNavigation[navigationItemIndex + 1];

          return (
            <Divider
              // eslint-disable-next-line react/no-array-index-key
              key={`divider-${depth}-${navigationItemIndex}`}
              sx={{
                borderBottomWidth: 2,
                mx: 1,
                mt: 1,
                mb: nextItem?.kind === 'header' && !isMini ? 0 : 1,
                ...(hasDrawerTransitions
                  ? getDrawerSxTransitionMixin(isFullyExpanded, 'margin')
                  : {}),
              }}
            />
          );
        }

        const navigationItemFullPath = getPageItemFullPath(
          basePath,
          navigationItem,
        );
        const navigationItemId = `${depth}-${navigationItemIndex}`;
        const navigationItemTitle = getItemTitle(navigationItem);

        const isNestedNavigationExpanded =
          expandedSidebarItemIds.includes(navigationItemId);

        const nestedNavigationCollapseIcon = isNestedNavigationExpanded ? (
          <ExpandLessIcon />
        ) : (
          <ExpandMoreIcon />
        );

        const listItemIconSize = 34;

        const isSelected = isPageItemSelected(
          navigationItem,
          basePath,
          pathname,
        );

        if (
          process.env.NODE_ENV !== 'production' &&
          isSelected &&
          selectedItemId
        ) {
          console.warn(
            `Duplicate selected path in navigation: ${navigationItemFullPath}`,
          );
        }

        if (isSelected && !selectedItemId) {
          // eslint-disable-next-line no-param-reassign
          selectedItemId = navigationItemId;
        }

        const listItem = (
          <ListItem
            sx={{
              py: 0,
              px: 1,
              overflowX: 'hidden',
            }}
          >
            <NavigationListItemButton
              selected={isSelected && (!navigationItem.children || isMini)}
              sx={{
                px: 1.4,
                height: 48,
              }}
              {...(navigationItem.children && !isMini
                ? {
                    onClick: handleOpenFolderClick(navigationItemId),
                  }
                : {
                    LinkComponent: NextLink,
                    href: navigationItemFullPath,
                    onClick: onLinkClick,
                  })}
            >
              {navigationItem.icon || isMini ? (
                <ListItemIcon
                  sx={{
                    minWidth: listItemIconSize,
                    mr: 1.2,
                  }}
                >
                  {navigationItem.icon ?? null}
                  {!navigationItem.icon && isMini ? (
                    <Avatar
                      sx={{
                        width: listItemIconSize - 7,
                        height: listItemIconSize - 7,
                        fontSize: 12,
                        ml: '-2px',
                      }}
                    >
                      {navigationItemTitle
                        .split(' ')
                        .slice(0, 2)
                        .map((itemTitleWord) =>
                          itemTitleWord.charAt(0).toUpperCase(),
                        )}
                    </Avatar>
                  ) : null}
                </ListItemIcon>
              ) : null}
              <ListItemText
                primary={navigationItemTitle}
                sx={{
                  whiteSpace: 'nowrap',
                  zIndex: 1,
                  '& .MuiTypography-root': {
                    fontWeight: '500',
                  },
                }}
              />
              {navigationItem.action && !isMini && isFullyExpanded
                ? navigationItem.action
                : null}
              {navigationItem.children && !isMini && isFullyExpanded
                ? nestedNavigationCollapseIcon
                : null}
            </NavigationListItemButton>
          </ListItem>
        );

        return (
          <React.Fragment key={navigationItemId}>
            {isMini ? (
              <Tooltip title={navigationItemTitle} placement="right">
                {listItem}
              </Tooltip>
            ) : (
              listItem
            )}

            {navigationItem.children && !isMini ? (
              <Collapse
                in={isNestedNavigationExpanded}
                timeout="auto"
                unmountOnExit
              >
                <DashboardSidebarSubNavigation
                  subNavigation={navigationItem.children}
                  basePath={navigationItemFullPath}
                  depth={depth + 1}
                  onLinkClick={onLinkClick}
                  selectedItemId={selectedItemId}
                />
              </Collapse>
            ) : null}
          </React.Fragment>
        );
      })}
    </List>
  );
}

export interface DashboardLayoutSlots {
  /**
   * The toolbar actions component used in the layout header.
   * @default ToolbarActions
   */
  toolbarActions?: React.JSXElementConstructor<{}>;
  /**
   * The toolbar account component used in the layout header.
   * @default Account
   */
  toolbarAccount?: React.JSXElementConstructor<AccountProps>;
}

export interface DashboardLayoutProps {
  /**
   * The content of the dashboard.
   */
  children: React.ReactNode;
  /**
   * Whether the sidebar should not be collapsible to a mini variant in desktop and tablet viewports.
   * @default false
   */
  disableCollapsibleSidebar?: boolean;
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots?: DashboardLayoutSlots;
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: {
    toolbarActions?: {};
    toolbarAccount?: AccountProps;
  };
}

/**
 *
 * Demos:
 *
 * - [Dashboard Layout](https://mui.com/toolpad/core/react-dashboard-layout/)
 *
 * API:
 *
 * - [DashboardLayout API](https://mui.com/toolpad/core/api/dashboard-layout)
 */
export function DashboardLayout(props: DashboardLayoutProps) {
  const {
    children,
    disableCollapsibleSidebar = false,
    slots,
    slotProps,
  } = props;

  const theme = useTheme();
  const navigation = MENU_NAVIGATION;
  /* 
  const appWindow = React.useContext(WindowContext);
  */

  const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] =
    React.useState(true);
  const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] =
    React.useState(false);

  const isUnderMdViewport = useMediaQuery(
    theme.breakpoints.down('md'),
    /* appWindow && {
      matchMedia: appWindow.matchMedia,
    }, */
  );
  const isOverSmViewport = useMediaQuery(
    theme.breakpoints.up('sm'),
    /* appWindow && {
      matchMedia: appWindow.matchMedia,
    }, */
  );

  const isNavigationExpanded = isUnderMdViewport
    ? isMobileNavigationExpanded
    : isDesktopNavigationExpanded;

  const setIsNavigationExpanded = React.useCallback(
    (newExpanded: boolean) => {
      if (isUnderMdViewport) {
        setIsMobileNavigationExpanded(newExpanded);
      } else {
        setIsDesktopNavigationExpanded(newExpanded);
      }
    },
    [isUnderMdViewport],
  );

  const [isNavigationFullyExpanded, setIsNavigationFullyExpanded] =
    React.useState(isNavigationExpanded);

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (isNavigationExpanded) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsNavigationFullyExpanded(true);
      }, theme.transitions.duration.enteringScreen);

      return () => clearTimeout(drawerWidthTransitionTimeout);
    }

    setIsNavigationFullyExpanded(false);
  }, [isNavigationExpanded, theme]);

  const selectedItemIdRef = React.useRef('');

  const handleSetNavigationExpanded = React.useCallback(
    (newExpanded: boolean) => () => {
      setIsNavigationExpanded(newExpanded);
    },
    [setIsNavigationExpanded],
  );

  const toggleNavigationExpanded = React.useCallback(() => {
    setIsNavigationExpanded(!isNavigationExpanded);
  }, [isNavigationExpanded, setIsNavigationExpanded]);

  const handleNavigationLinkClick = React.useCallback(() => {
    selectedItemIdRef.current = '';
    setIsMobileNavigationExpanded(false);
  }, [setIsMobileNavigationExpanded]);

  // If useEffect was used, the reset would also happen on the client render after SSR which we don't need
  React.useMemo(() => {
    selectedItemIdRef.current = '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const isDesktopMini =
    !disableCollapsibleSidebar && !isDesktopNavigationExpanded;
  const isMobileMini =
    !disableCollapsibleSidebar && !isMobileNavigationExpanded;

  const getMenuIcon = React.useCallback(
    (isExpanded: boolean) => {
      const expandMenuActionText = 'Expand';
      const collapseMenuActionText = 'Collapse';

      return (
        <Tooltip
          title={`${isExpanded ? collapseMenuActionText : expandMenuActionText} menu`}
          enterDelay={1000}
        >
          <div>
            <IconButton
              aria-label={`${isExpanded ? collapseMenuActionText : expandMenuActionText} navigation menu`}
              onClick={toggleNavigationExpanded}
            >
              {isExpanded ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          </div>
        </Tooltip>
      );
    },
    [toggleNavigationExpanded],
  );

  const hasDrawerTransitions =
    isOverSmViewport && (disableCollapsibleSidebar || !isUnderMdViewport);

  const getDrawerContent = React.useCallback(
    (isMini: boolean, ariaLabel: string) => (
      <>
        <Toolbar />
        <Box
          component="nav"
          aria-label={ariaLabel}
          sx={{
            overflow: 'auto',
            pt: 2,
            ...(hasDrawerTransitions
              ? getDrawerSxTransitionMixin(isNavigationFullyExpanded, 'padding')
              : {}),
          }}
        >
          <DashboardSidebarSubNavigation
            subNavigation={navigation}
            onLinkClick={handleNavigationLinkClick}
            isMini={isMini}
            isFullyExpanded={isNavigationFullyExpanded}
            hasDrawerTransitions={hasDrawerTransitions}
            selectedItemId={selectedItemIdRef.current}
          />
        </Box>
      </>
    ),
    [
      handleNavigationLinkClick,
      hasDrawerTransitions,
      isNavigationFullyExpanded,
      navigation,
    ],
  );

  const getDrawerSharedSx = React.useCallback(
    (isMini: boolean) => {
      const drawerWidth = isMini ? 60 : 190;

      return {
        width: drawerWidth,
        flexShrink: 0,
        ...getDrawerWidthTransitionMixin(isNavigationExpanded),
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundImage: 'none',
          background: 'transparent',
          border: '0',
          ...getDrawerWidthTransitionMixin(isNavigationExpanded),
        },
      };
    },
    [isNavigationExpanded],
  );

  const ToolbarActionsSlot = slots?.toolbarActions ?? ToolbarActions;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar color="transparent" position="fixed" sx={{ border: 'none' }}>
        {
          // TODO: (minWidth: 100vw) Temporary fix to issue reported in https://github.com/mui/material-ui/issues/43244
        }
        <Toolbar
          sx={{
            backgroundColor: 'inherit',
            minWidth: '100vw',
            justifyContent: 'space-between',
            mx: { xs: -0.75, sm: -1.5 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexGrow: '1',
              justifyContent: 'flex-start',
            }}
          >
            <Box
              sx={{
                mr: { sm: disableCollapsibleSidebar ? 0 : 1 },
                display: { md: 'none' },
              }}
            >
              {getMenuIcon(isMobileNavigationExpanded)}
            </Box>
            <Box
              sx={{
                display: {
                  xs: 'none',
                  md: disableCollapsibleSidebar ? 'none' : 'block',
                },
                mr: disableCollapsibleSidebar ? 0 : 1,
              }}
            >
              {getMenuIcon(isDesktopNavigationExpanded)}
            </Box>
            <Box
              sx={{
                position: { xs: 'absolute', md: 'static' },
                left: { xs: '50%', md: 'auto' },
                transform: { xs: 'translateX(-50%)', md: 'none' },
              }}
            >
              <Link
                href="/"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <Stack direction="row" alignItems="center">
                  <LogoContainer>
                    <Image
                      height={46}
                      width={113}
                      alt="Polymesh Logo"
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTU4IiBoZWlnaHQ9IjIyIiB2aWV3Qm94PSIwIDAgMTU4IDIyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMl8xMTM1KSI+CjxtYXNrIGlkPSJtYXNrMF8yXzExMzUiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTU4IiBoZWlnaHQ9IjIyIj4KPHBhdGggZD0iTTE1Ny4zODkgMC45ODQ2MTlIMFYyMS4xMzA0SDE1Ny4zODlWMC45ODQ2MTlaIiBmaWxsPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazBfMl8xMTM1KSI+CjxtYXNrIGlkPSJtYXNrMV8yXzExMzUiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTU4IiBoZWlnaHQ9IjIwIj4KPHBhdGggZD0iTTE1Ny43NiAwLjU2NDk0MUgwLjM3MDExN1YxOS45OTEySDE1Ny43NlYwLjU2NDk0MVoiIGZpbGw9IndoaXRlIi8+CjwvbWFzaz4KPGcgbWFzaz0idXJsKCNtYXNrMV8yXzExMzUpIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMC4zNSAxNy4wNjVDMTkuNTEgMTYuMTcxMyAxOC44NyAxNS4xNDQyIDE4LjQxIDEzLjk4NjNWMTMuOTg0N0MxNy45NSAxMi44MDY2IDE3LjczIDExLjU1NDIgMTcuNzMgMTAuMjNDMTcuNzMgOC44ODgxNCAxNy45NSA3LjYzNTA0IDE4LjQxIDYuNDczNzRDMTguODcgNS4zMTU3NCAxOS41MSA0LjI4ODg0IDIwLjM1IDMuMzk1MDRWMy4zOTI1NEMyMS4yMSAyLjQ5NjE0IDIyLjIzIDEuODAwNzQgMjMuNDEgMS4zMDY1NEMyNC41OSAwLjgxMDY0MSAyNS44OTAxIDAuNTY0OTQxIDI3LjMxMDEgMC41NjQ5NDFDMjguNzIwMSAwLjU2NDk0MSAzMC4wMjAxIDAuODEwNjQxIDMxLjIwMDEgMS4zMDY1NEMzMi4zODAxIDEuODAwNzQgMzMuMzkgMi40OTY0NCAzNC4yMyAzLjM5Mzc0QzM1LjA5IDQuMjg3NDQgMzUuNzQwMSA1LjMxNDg0IDM2LjIwMDEgNi40NzM3NEMzNi42NjAxIDcuNjM1MDQgMzYuODggOC44ODgxNCAzNi44OCAxMC4yM0MzNi44OCAxMS41NTQyIDM2LjY2MDEgMTIuODA2NiAzNi4yMDAxIDEzLjk4NDdWMTMuOTg2M0MzNS43NDAxIDE1LjE0NTMgMzUuMDkgMTYuMTcyNiAzNC4yMyAxNy4wNjYzQzMzLjM5IDE3Ljk2MzYgMzIuMzgwMSAxOC42NTkzIDMxLjIwMDEgMTkuMTUzNUMzMC4wMjAxIDE5LjY0OTUgMjguNzIwMSAxOS44OTUxIDI3LjMxMDEgMTkuODk1MUMyNS44OTAxIDE5Ljg5NTEgMjQuNTkgMTkuNjQ5NSAyMy40MSAxOS4xNTM1QzIyLjIzIDE4LjY1OTMgMjEuMjEgMTcuOTYzOSAyMC4zNSAxNy4wNjc2VjE3LjA2NVpNMzAuOTggNC4xNDEzNEMyOS45NyAzLjUxNDE0IDI4Ljc1MDEgMy4xOTM2NCAyNy4zMTAxIDMuMTkzNjRDMjUuODgwMSAzLjE5MzY0IDI0LjY2IDMuNTEzNzQgMjMuNjMgNC4xNDI1NFY0LjE0NDU0QzIyLjU5IDQuNzU5OTQgMjEuNzkgNS41OTI0NCAyMS4yMyA2LjY0NTg0QzIwLjY5IDcuNzAxNDQgMjAuNDEgOC44OTQwNCAyMC40MSAxMC4yM0MyMC40MSAxMS41NDY1IDIwLjY4IDEyLjczOTcgMjEuMjMgMTMuODE1MUMyMS43OSAxNC44NjgzIDIyLjU5IDE1LjcxMDIgMjMuNjMgMTYuMzQ0MUMyNC42NiAxNi45NTUxIDI1Ljg4MDEgMTcuMjY2NCAyNy4zMTAxIDE3LjI2NjRDMjguNzUwMSAxNy4yNjY0IDI5Ljk3IDE2Ljk1NDYgMzAuOTggMTYuMzQ0OEMzMi4wMiAxNS43MTA5IDMyLjgxIDE0Ljg2ODkgMzMuMzUgMTMuODE2VjEzLjgxNDJDMzMuOTIgMTIuNzM4OSAzNC4yMDAxIDExLjU0NiAzNC4yMDAxIDEwLjIzQzM0LjIwMDEgOC44OTQ4NCAzMy45MiA3LjcwMjk0IDMzLjM1IDYuNjQ3NjRWNi42NDQwNEMzMi44MSA1LjU5MTc0IDMyLjAyIDQuNzU5ODQgMzAuOTggNC4xNDQ1NFY0LjE0MTM0Wk00NS4wMiAwLjc4NTg0MVYxNy4wNzMySDU0Ljk5VjE5LjY3NDNINDIuMzRWMC43ODU4NDFINDUuMDJaTTYyLjUgMTkuNjc0M1YxMi4yMzA5TDU0LjU1IDAuNzg1ODQxSDU3LjgxMDFMNjMuODMwMSA5LjQ0NDQ0TDY5Ljg1IDAuNzg1ODQxSDczLjExTDY1LjE5MDEgMTIuMjMwNlYxOS42NzQzSDYyLjVaTTgwLjE1IDAuNzg1ODQxTDg2LjUzIDkuMjQ4ODRMOTIuODEwMSAwLjc4NTg0MUg5NS42N1YxOS42NzQzSDkyLjk5VjUuMTMzNTRMODYuNTQgMTMuNDMyNUw3OS45NyA1LjEyMjI0VjE5LjY3NDNINzcuMjlWMC43ODU4NDFIODAuMTVaTTEwMi4yOCAwLjc4NTg0MUgxMTYuMzNWMy4zODY4NEgxMDQuOTZWOC45MDE5NEgxMTUuMTJWMTEuNTMwNkgxMDQuOTZWMTcuMDczMkgxMTYuMzNWMTkuNjc0M0gxMDIuMjhWMC43ODU4NDFaTTEyNC4xNiAxOS4xNTI4VjE5LjE1MTJDMTIyLjk5IDE4LjYzNDggMTIyLjEgMTcuOTE5MiAxMjEuNDkgMTYuOTk2N1YxNi45OTI4QzEyMC45MSAxNi4wODM0IDEyMC41NyAxNS4wNTk3IDEyMC40NyAxMy45Mjc1TDEyMC40NSAxMy41OTQ5SDEyMy4yMkwxMjMuMjQgMTMuODgyNEMxMjMuMjkgMTQuNzAzOSAxMjMuNTYgMTUuMzQ4NCAxMjQuMDMgMTUuODRDMTI0LjUzIDE2LjMyOTkgMTI1LjE3IDE2LjcwMjEgMTI2IDE2Ljk0NzZDMTI2Ljg1IDE3LjE5NiAxMjcuNzkgMTcuMzIxNiAxMjguODEgMTcuMzIxNkMxMzAuMzIgMTcuMzIxNiAxMzEuNDggMTcuMDU5NyAxMzIuMzIgMTYuNTY0OUMxMzMuMTMgMTYuMDY5MyAxMzMuNTIgMTUuMzU5NiAxMzMuNTIgMTQuMzk4NUMxMzMuNTIgMTMuODM3NSAxMzMuMzMgMTMuNDExIDEzMi45NCAxMy4wODc0TDEzMi45MyAxMy4wNzg5QzEzMi41MyAxMi43MTA1IDEzMS45OCAxMi4zOTczIDEzMS4yNSAxMi4xNDlDMTMwLjUyIDExLjg5NTYgMTI5LjcyIDExLjY2NzggMTI4Ljg1IDExLjQ2NzVWMTEuNDY2MkMxMjcuOTYgMTEuMjQ1IDEyNy4wNyAxMS4wMTQ1IDEyNi4xNiAxMC43NzVDMTI1LjI2IDEwLjUzMTIgMTI0LjQzIDEwLjIyMDQgMTIzLjY1IDkuODQzMTRWOS44NDE4NEMxMjIuODggOS40NTY1NCAxMjIuMjUgOC45NjA5NCAxMjEuNzYgOC4zNTIxNEwxMjEuNzUgOC4zNDM3NEMxMjEuMjYgNy42OTA3NCAxMjEuMDIgNi44NzY0NCAxMjEuMDIgNS45MjM1NEMxMjEuMDIgNC4zNDIwNCAxMjEuNjQgMy4wNDAxNCAxMjIuODUgMi4wNDI3NFYyLjA0MTE0QzEyNC4wOSAxLjA0MDM0IDEyNS44OSAwLjU2NDk0MSAxMjguMiAwLjU2NDk0MUMxMjkuODUgMC41NjQ5NDEgMTMxLjIzIDAuODE3MTQxIDEzMi4zMyAxLjMzOTA0QzEzMy40MiAxLjgzNTk0IDEzNC4yNSAyLjUwNDM0IDEzNC44MSAzLjM1Mjk0QzEzNS4zNyA0LjE4NzM0IDEzNS42OCA1LjA5NDg0IDEzNS43NCA2LjA3MDg0TDEzNS43NiA2LjM5NTk0SDEzMy4wNEwxMzMgNi4xMjU3NEMxMzIuOSA1LjI5NjA0IDEzMi40OSA0LjU5NDI0IDEzMS43NCA0LjAxMzA0VjQuMDEwMzRDMTMxLjAxIDMuNDI4OTQgMTI5Ljg1IDMuMTEwODQgMTI4LjIgMy4xMTA4NEMxMjcuMTkgMy4xMTA4NCAxMjYuMzkgMy4yMTA4NCAxMjUuNzggMy40MDAzNEMxMjUuMTcgMy41OTQxNCAxMjQuNzIgMy44NDE5NCAxMjQuNDEgNC4xMzEwNEMxMjQuMTEgNC40MTYzNCAxMjMuOTEgNC43MDczNCAxMjMuOCA1LjAwMTU0QzEyMy43IDUuMzIzNjQgMTIzLjY1IDUuNjIxMjQgMTIzLjY1IDUuODk1OTRDMTIzLjY1IDYuNDE1OTQgMTIzLjg0IDYuODI2MTQgMTI0LjIxIDcuMTUxNDRDMTI0LjYzIDcuNDg5NjQgMTI1LjE5IDcuNzg1ODQgMTI1LjkgOC4wMzQyNEMxMjYuNjQgOC4yNjk5NCAxMjcuNDYgOC40ODgxNCAxMjguMzUgOC42ODg1NEMxMjkuMjYgOC44OTIwNCAxMzAuMTYgOS4xMjM0NCAxMzEuMDQgOS4zODI0NEMxMzEuOTYgOS42MjYzNCAxMzIuOCA5Ljk0NjA0IDEzMy41NiAxMC4zNDI4QzEzNC4zNSAxMC43Mjg1IDEzNC45OCAxMS4yMzUgMTM1LjQ2IDExLjg2NTlDMTM1Ljk2IDEyLjUxOTkgMTM2LjIxIDEzLjM0NDcgMTM2LjIxIDE0LjMxNTdDMTM2LjIxIDE2LjA5OTggMTM1LjUyIDE3LjUwMyAxMzQuMTUgMTguNDg1M1YxOC40ODdDMTMyLjc5IDE5LjQzNzMgMTMwLjk1IDE5Ljg5NTEgMTI4LjY3IDE5Ljg5NTFDMTI2Ljg1IDE5Ljg5NTEgMTI1LjM0IDE5LjY1MzMgMTI0LjE2IDE5LjE1MjhaTTE0MS41NiAwLjc4NTg0MUgxNDQuMjRWOC45MDE5NEgxNTQuMjZWMC43ODU4NDFIMTU2Ljk0VjE5LjY3NDNIMTU0LjI2VjExLjUzMDZIMTQ0LjI0VjE5LjY3NDNIMTQxLjU2VjAuNzg1ODQxWiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzJfMTEzNSkiLz4KPHBhdGggZD0iTTYuNzgwMTUgOS44OTAxNEM4LjIxMDE1IDkuODkwMTQgOS4yMTAyIDkuNTk1MDQgOS44MzAyIDkuMDUwMzRDMTAuNDQwMiA4LjQ4NTU0IDEwLjc2MDEgNy42NzM0NCAxMC43NjAxIDYuNTgwMDRDMTAuNzYwMSA1LjQ1NDk0IDEwLjQzMDIgNC40ODYxNCA5LjgzMDIgMy45NDY2NEM5LjIxMDIgMy40MDEyNCA4LjIxMDE1IDMuMTA1NzQgNi43ODAxNSAzLjEwNTc0SDAuMzcwMTE3VjAuNTY0OTQxSDcuMTIwMTJDOC4zOTAxMiAwLjU2NDk0MSA5LjUxMDA4IDAuODAzMTQxIDEwLjQ2MDEgMS4yODgxNEMxMS40MzAxIDEuNzUzNTQgMTIuMTkwMSAyLjQyNTE0IDEyLjc0MDEgMy4zMDIwNEMxMy4yOTAxIDQuMTg3MjQgMTMuNTUwMiA1LjM5NDQ0IDEzLjU1MDIgNi41ODAwNEMxMy41NTAyIDcuNzcxOTQgMTMuMjgwMSA4LjgxMjk0IDEyLjc0MDEgOS42OTM4NEMxMi4xOTAxIDEwLjU3MDYgMTEuNDMwMSAxMS4yNTEyIDEwLjQ2MDEgMTEuNzM1M0M5LjUxMDA4IDEyLjIwMTMgOC4zOTAxMiAxMi40MzA5IDcuMTIwMTIgMTIuNDMwOUgzLjA1MDE3VjE5LjY1ODZIMC4zNzAxMTdWOS44OTAxNEg2Ljc4MDE1WiIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzJfMTEzNSkiLz4KPC9nPgo8L2c+CjwvZz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8yXzExMzUiIHgxPSI4Ny4zMyIgeTE9IjAuNTY0OTQxIiB4Mj0iODcuMzMiIHkyPSIxOS44OTUxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNERjJBNkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNTYxNDVGIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8yXzExMzUiIHgxPSI2Ljk2MDE0IiB5MT0iMC41NjQ5NDEiIHgyPSI2Ljk2MDE0IiB5Mj0iMTkuNjU4NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjREYyQTZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzU2MTQ1RiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzJfMTEzNSI+CjxyZWN0IHdpZHRoPSIxNTcuMzg5IiBoZWlnaHQ9IjIxLjEzMDMiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg=="
                    />
                  </LogoContainer>
                  <Typography
                    variant="h6"
                    sx={{
                      color: (theme.vars ?? theme).palette.primary.main,
                      fontWeight: '100',
                      ml: 1,
                      fontSize: '1rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    EXPLORER
                  </Typography>
                </Stack>
              </Link>
            </Box>
          </Box>
          <Stack direction="row" flexGrow={1}>
            <ToolbarActionsSlot {...slotProps?.toolbarActions} />
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        // container={appWindow?.document.body}
        variant="temporary"
        open={isMobileNavigationExpanded}
        onClose={handleSetNavigationExpanded(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: {
            xs: 'block',
            sm: disableCollapsibleSidebar ? 'block' : 'none',
            md: 'none',
          },
          ...getDrawerSharedSx(false),
        }}
      >
        {getDrawerContent(false, 'Phone')}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: 'none',
            sm: disableCollapsibleSidebar ? 'none' : 'block',
            md: 'none',
          },
          ...getDrawerSharedSx(isMobileMini),
        }}
      >
        {getDrawerContent(isMobileMini, 'Tablet')}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          ...getDrawerSharedSx(isDesktopMini),
        }}
      >
        {getDrawerContent(isDesktopMini, 'Desktop')}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // TODO: Temporary fix to issue reported in https://github.com/mui/material-ui/issues/43244
          minWidth: {
            xs:
              disableCollapsibleSidebar && isNavigationExpanded
                ? '100vw'
                : 'auto',
            md: 'auto',
          },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

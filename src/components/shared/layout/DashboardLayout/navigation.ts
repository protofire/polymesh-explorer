import {
  NavigationItem,
  NavigationPageItem,
  NavigationSubheaderItem,
} from '@toolpad/core/AppProvider';

export const getItemKind = (item: NavigationItem) => item.kind ?? 'page';

export const isPageItem = (item: NavigationItem): item is NavigationPageItem =>
  getItemKind(item) === 'page';

export const getItemTitle = (
  item: NavigationPageItem | NavigationSubheaderItem,
) => {
  return isPageItem(item) ? (item.title ?? item.segment ?? '') : item.title;
};

export function getPageItemFullPath(
  basePath: string,
  navigationItem: NavigationPageItem,
) {
  return `${basePath}${basePath && !navigationItem.segment ? '' : '/'}${navigationItem.segment ?? ''}`;
}

export function isPageItemSelected(
  navigationItem: NavigationPageItem,
  basePath: string,
  pathname: string,
) {
  if (navigationItem.pattern) {
    const pattern = new RegExp(
      `^${basePath}/${navigationItem.pattern.replace(/\*/g, '.*')}$`,
    );
    return pattern.test(pathname);
  }
  // Fallback to checking the full path equality
  return getPageItemFullPath(basePath, navigationItem) === pathname;
}

export function hasSelectedNavigationChildren(
  navigationItem: NavigationItem,
  basePath: string,
  pathname: string,
): boolean {
  if (isPageItem(navigationItem) && navigationItem.children) {
    const navigationItemFullPath = getPageItemFullPath(
      basePath,
      navigationItem,
    );

    return navigationItem.children.some((nestedNavigationItem) => {
      if (!isPageItem(nestedNavigationItem)) {
        return false;
      }

      if (nestedNavigationItem.children) {
        return hasSelectedNavigationChildren(
          nestedNavigationItem,
          navigationItemFullPath,
          pathname,
        );
      }

      return isPageItemSelected(
        nestedNavigationItem,
        navigationItemFullPath,
        pathname,
      );
    });
  }

  return false;
}

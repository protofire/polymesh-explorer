import { Box, List, ListItem, ListItemButton, Skeleton } from '@mui/material';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';

export function PortfoliosTabSkeleton() {
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Box sx={{ width: '30%', borderRight: 1, borderColor: 'divider', pr: 2 }}>
        <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
        <List>
          {Array.from({ length: 5 }, (_, index) => (
            <ListItem key={`skeleton-item-${index}`} disablePadding>
              <ListItemButton>
                <Skeleton variant="text" width="100%" height={24} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ width: '70%', pl: 2 }}>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={48}
          sx={{ mb: 2 }}
        />
        <GenericTableSkeleton columnCount={4} rowCount={3} />
      </Box>
    </Box>
  );
}

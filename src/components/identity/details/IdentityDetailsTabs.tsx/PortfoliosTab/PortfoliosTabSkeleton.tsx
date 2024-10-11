import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {Array.from({ length: 4 }, (_, index) => (
                  <TableCell key={`skeleton-cell-${index}`}>
                    <Skeleton variant="text" width="100%" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 5 }, (_, rowIndex) => (
                <TableRow key={`row-${rowIndex}`}>
                  {Array.from({ length: 4 }, (__, cellIndex) => (
                    <TableCell key={`cell-${rowIndex}-${cellIndex}`}>
                      <Skeleton variant="text" width="100%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

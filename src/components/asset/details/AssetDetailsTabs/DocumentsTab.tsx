import React from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Tooltip,
  Link,
} from '@mui/material';
import { ContentCopy, OpenInNew } from '@mui/icons-material';
import { AssetDetails } from '@/domain/entities/Asset';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { useLocalPagination } from '@/hooks/useLocalPagination';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import CopyButton from '@/components/shared/common/CopyButton';

interface DocumentsTabProps {
  assetDetails: AssetDetails | null;
  isLoading: boolean;
  error: Error | null;
}

export function DocumentsTab({
  assetDetails,
  isLoading,
  error,
}: DocumentsTabProps): React.ReactElement {
  const documents = assetDetails?.metadata?.filter(
    (entry) => entry.type === 'document'
  );

  const { paginatedItems: paginatedDocuments, ...paginationController } =
    useLocalPagination(documents || []);

  if (isLoading) {
    return <GenericTableSkeleton columnCount={5} rowCount={5} />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Filed At</TableCell>
              <TableCell>Content Hash</TableCell>
              <TableCell>URI</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDocuments.length > 0 ? (
              paginatedDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>
                    {doc.filedAt && <FormattedDate date={doc.filedAt} />}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {doc.contentHash}
                      </Typography>
                      {doc.contentHash && (
                        <CopyButton text={doc.contentHash} size="small" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {doc.uri}
                      </Typography>
                      {doc.uri && (
                        <>
                          <CopyButton text={doc.uri} size="small" />
                          <Tooltip title="Open in new tab">
                            <IconButton
                              size="small"
                              component={Link}
                              href={doc.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <OpenInNew fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <NoDataAvailableTBody
                colSpan={5}
                message="No documents available."
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter paginationController={paginationController} />
    </>
  );
} 
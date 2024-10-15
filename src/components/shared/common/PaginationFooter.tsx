import React from 'react';
import { Box, TablePagination, IconButton } from '@mui/material';
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { PaginationController } from '@/domain/ui/PaginationInfo';

interface PaginationFooterProps {
  paginationController: PaginationController;
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page + 1);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0 || count === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0 || count === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1 || count === 0}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
}

export function PaginationFooter({
  paginationController,
}: PaginationFooterProps) {
  const { paginationInfo, ...pagination } = paginationController;

  const handleChangePage = React.useCallback(
    (event: unknown, newPage: number) => {
      if (newPage === 0) {
        pagination.goToFirstPage();
      } else if (newPage > paginationInfo.currentPage - 1) {
        pagination.goToNextPage(event, newPage);
      } else if (newPage < paginationInfo.currentPage - 1) {
        pagination.goToPreviousPage();
      }
    },
    [pagination, paginationInfo.currentPage],
  );

  const handleChangeRowsPerPage = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (paginationInfo.totalCount > 0) {
        pagination.changePageSize(event);
      }
    },
    [pagination, paginationInfo.totalCount],
  );

  return (
    <TablePagination
      component="div"
      count={paginationInfo.totalCount}
      page={paginationInfo.currentPage - 1}
      onPageChange={handleChangePage}
      rowsPerPage={paginationInfo.pageSize}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={paginationInfo.totalCount > 0 ? [10, 30, 50] : []}
      ActionsComponent={TablePaginationActions}
      disabled={paginationInfo.totalCount <= paginationInfo.pageSize}
    />
  );
}

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Tooltip } from '@mui/material';

interface CheckBooleanFieldProps {
  value: boolean;
}

export function CheckBooleanField({ value }: CheckBooleanFieldProps) {
  return (
    <Box display="flex" alignItems="center">
      {value ? (
        <Tooltip title="Success">
          <CheckCircleIcon color="success" fontSize="small" />
        </Tooltip>
      ) : (
        <Tooltip title="Failed">
          <CancelIcon color="error" fontSize="small" />
        </Tooltip>
      )}
    </Box>
  );
}

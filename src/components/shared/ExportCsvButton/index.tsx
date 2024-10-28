import React from 'react';
import { ButtonBase, styled, Typography } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface ExportCsvButtonProps {
  onExport: () => void;
  disabled?: boolean;
}

const StyledButton = styled(ButtonBase)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  borderRadius: '20px',
  backgroundColor: 'transparent',
  transition: 'all 0.2s ease-in-out',
  height: '32px',
  '&:hover': {
    backgroundColor: 'rgba(255, 0, 128, 0.1)',
    boxShadow: '0 0 8px rgba(255, 0, 128, 0.4)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    border: '1px solid rgba(255, 0, 128, 0.5)',
  },
}));

const StyledIcon = styled(FileDownloadIcon)({
  fontSize: '20px',
});

export function ExportCsvButton({ onExport, disabled }: ExportCsvButtonProps) {
  return (
    <StyledButton onClick={onExport} disabled={disabled}>
      <StyledIcon />
      <Typography
        variant="button"
        sx={{
          fontSize: '14px',
          fontWeight: 500,
          letterSpacing: '0.5px',
          lineHeight: 1,
        }}
      >
        Export CSV
      </Typography>
    </StyledButton>
  );
}

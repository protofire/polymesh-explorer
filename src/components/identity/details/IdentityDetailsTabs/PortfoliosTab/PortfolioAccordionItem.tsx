import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { PortfolioWithAssets } from '@/domain/entities/Portfolio';
import { truncateAddress } from '@/services/polymesh/address';
import CopyButton from '@/components/shared/common/CopyButton';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';

interface PortfolioAccordionItemProps {
  portfolio: PortfolioWithAssets;
  isSelected: boolean;
  onSelect: (portfolio: PortfolioWithAssets) => void;
}

export function PortfolioAccordionItem({
  portfolio,
  isSelected,
  onSelect,
}: PortfolioAccordionItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleChange = (event: React.SyntheticEvent, expanded: boolean) => {
    setIsExpanded(expanded);
  };

  return (
    <Accordion
      disableGutters
      elevation={0}
      onChange={handleChange}
      sx={{
        '&:before': { display: 'none' },
        backgroundColor: 'transparent',
        '& .MuiAccordionSummary-expandIconWrapper': {
          transition: 'color 0.2s',
          '&:hover': {
            color: 'primary.main',
          },
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          isExpanded ? (
            <ExpandMoreIcon />
          ) : (
            <Tooltip
              title={`Show ${portfolio.name} details`}
              placement="right-start"
            >
              <ExpandMoreIcon />
            </Tooltip>
          )
        }
        sx={{
          p: 0,
          minHeight: 48,
          '& .MuiAccordionSummary-content': { m: 0 },
        }}
      >
        <ListItem disablePadding>
          <ListItemButton
            selected={isSelected}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(portfolio);
            }}
            sx={{ pr: 6 }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>{portfolio.name}</Typography>
                  {portfolio.custodianDid && (
                    <Tooltip
                      title="Custodian with another identity"
                      placement="right"
                    >
                      <AccountBalanceIcon
                        sx={{
                          fontSize: 16,
                          color: 'warning.main',
                          opacity: 0.8,
                        }}
                      />
                    </Tooltip>
                  )}
                  {portfolio.otherOwner && (
                    <Tooltip title="Custodied" placement="right">
                      <AccountBalanceWalletIcon
                        sx={{
                          fontSize: 16,
                          color: (theme) => theme.palette.primary.main,
                          opacity: 0.8,
                        }}
                      />
                    </Tooltip>
                  )}
                </Box>
              }
            />
          </ListItemButton>
        </ListItem>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          p: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderBottomLeftRadius: 1,
          borderBottomRightRadius: 1,
          mx: 0,
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box>
            <Typography
              variant="caption"
              component="div"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 0.5,
              }}
            >
              Number
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                {portfolio.number}
              </Typography>
              <CopyButton text={portfolio.id} />
            </Box>
          </Box>

          <Box>
            <Typography
              variant="caption"
              component="div"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 0.5,
              }}
            >
              Name
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
            >
              {portfolio.name}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              component="div"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 0.5,
              }}
            >
              ID
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                {truncateAddress(portfolio.id)}
              </Typography>
              <CopyButton text={portfolio.id} />
            </Box>
          </Box>

          {portfolio.custodianDid && (
            <Box>
              <Typography
                variant="caption"
                component="div"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                Custodied by:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountOrDidTextField
                  value={portfolio.custodianDid}
                  isIdentity
                  variant="body2"
                />
              </Box>
            </Box>
          )}

          {portfolio.otherOwner && (
            <Box>
              <Typography
                variant="caption"
                component="div"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                Owner:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountOrDidTextField
                  value={portfolio.otherOwner}
                  isIdentity
                  variant="body2"
                />
              </Box>
            </Box>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

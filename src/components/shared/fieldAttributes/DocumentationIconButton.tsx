import { IconButton, Tooltip } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export type PolymeshEntity =
  | 'asset'
  | 'identity'
  | 'account'
  | 'venue'
  | 'settlement';

const POLYMESH_DOC_BASE_URL =
  'https://developers.polymesh.network/polymesh-docs/primitives';

const DOCS_URLS: Record<PolymeshEntity, { name: string; link: string }> = {
  asset: {
    name: 'Asset',
    link: `${POLYMESH_DOC_BASE_URL}/asset`,
  },
  identity: {
    name: 'Identity',
    link: `${POLYMESH_DOC_BASE_URL}/identity`,
  },
  account: {
    name: 'Account',
    link: `${POLYMESH_DOC_BASE_URL}/identity/#key-types`,
  },
  venue: {
    name: 'Venue',
    link: `${POLYMESH_DOC_BASE_URL}/settlement/#legs-instruction-and-venues`,
  },
  settlement: {
    name: 'Settlement',
    link: `${POLYMESH_DOC_BASE_URL}/settlement`,
  },
};

export function DocumentationIconButton({
  polymeshEntity,
}: {
  polymeshEntity: PolymeshEntity;
}) {
  return (
    <Tooltip
      title={`View Polymesh ${DOCS_URLS[polymeshEntity].name} Documentation`}
    >
      <IconButton
        size="small"
        onClick={() => window.open(DOCS_URLS[polymeshEntity].link, '_blank')}
      >
        <MenuBookIcon />
      </IconButton>
    </Tooltip>
  );
}

import { ExplorerConfig, ExplorerLink, ExplorerLinkProps } from '.';

interface Props
  extends Partial<Pick<ExplorerConfig, 'path' | 'baseUrl'>>,
    Partial<Pick<ExplorerLinkProps, 'sx' | 'toolTipText'>> {
  hash: string;
}

export function PolymeshExplorerLink({
  baseUrl,
  hash,
  path = 'extrinsic',
  sx,
  toolTipText,
}: Props) {
  return (
    <ExplorerLink
      explorerConfig={{ baseUrl: baseUrl as string, path }}
      txHash={hash}
      sx={sx}
      toolTipText={toolTipText}
    />
  );
}

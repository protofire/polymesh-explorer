import { ExplorerConfig, ExplorerLink } from '.';

interface Props extends Partial<Pick<ExplorerConfig, 'path' | 'baseUrl'>> {
  hash: string;
}

export function PolymeshExplorerLink({
  baseUrl,
  hash,
  path = 'extrinsic',
}: Props) {
  return (
    <ExplorerLink
      explorerConfig={{ baseUrl: baseUrl as string, path }}
      txHash={hash}
    />
  );
}

import { useQuery } from '@tanstack/react-query';
import { AccountRepository } from '@/services/repositories/AccountRepository';

const accountRepository = new AccountRepository();

export const useAccount = (publicKey: string) => {
  return useQuery({
    queryKey: ['account', publicKey],
    queryFn: () => accountRepository.getAccountByPublicKey(publicKey),
    enabled: !!publicKey,
  });
};

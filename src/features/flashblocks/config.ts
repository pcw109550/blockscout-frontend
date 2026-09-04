// SPDX-License-Identifier: LicenseRef-Blockscout

import type { FlashblocksName } from 'src/features/flashblocks/types/config';
import { DEFAULT_FLASHBLOCKS_NAME, FLASHBLOCKS_NAMES } from 'src/features/flashblocks/types/config';

import megaEthFeature from 'src/features/chain-variants/mega-eth/config';

import { getEnvValue } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const title = 'Flashblocks';

const socketUrl = getEnvValue('NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL');

// Every user-facing string (blocks tab, stats labels, hints, notices) derives from `name`.
const getOpStackName = (): FlashblocksName => {
  const value = getEnvValue('NEXT_PUBLIC_FLASHBLOCKS_NAME');
  return FLASHBLOCKS_NAMES.find((name) => name === value) ?? DEFAULT_FLASHBLOCKS_NAME;
};

const config: Feature<{ socketUrl: string; type: 'optimism' | 'megaEth'; name: FlashblocksName | 'mini-block' }> = (() => {
  if (megaEthFeature.isEnabled && megaEthFeature.socketUrl.rpc) {
    return Object.freeze({
      title,
      isEnabled: true,
      socketUrl: megaEthFeature.socketUrl.rpc,
      type: 'megaEth',
      name: 'mini-block',
    });
  }

  if (socketUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      socketUrl,
      type: 'optimism',
      name: getOpStackName(),
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;

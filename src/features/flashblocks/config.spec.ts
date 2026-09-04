// SPDX-License-Identifier: LicenseRef-Blockscout

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

// the feature config is a frozen module-level singleton, so it has to be imported inside `withEnvs`
async function loadConfig(envs: Array<[ string, string ]>) {
  return withEnvs(envs, async() => (await import('./config')).default);
}

describe('flashblocks feature config', () => {
  it('is disabled without a socket url', async() => {
    expect((await loadConfig([])).isEnabled).toBe(false);
  });

  it('calls the OP Stack feed "flashblock" unless told otherwise', async() => {
    expect(await loadConfig(ENVS_MAP.flashblocks)).toMatchObject({ isEnabled: true, type: 'optimism', name: 'flashblock' });
  });

  it('calls the OP Stack feed "subblock" when NEXT_PUBLIC_FLASHBLOCKS_NAME says so', async() => {
    const config = await loadConfig([ ...ENVS_MAP.flashblocks, [ 'NEXT_PUBLIC_FLASHBLOCKS_NAME', 'subblock' ] ]);
    expect(config).toMatchObject({ isEnabled: true, type: 'optimism', name: 'subblock' });
  });

  it('falls back to "flashblock" on a name it does not know', async() => {
    const config = await loadConfig([ ...ENVS_MAP.flashblocks, [ 'NEXT_PUBLIC_FLASHBLOCKS_NAME', 'miniblock' ] ]);
    expect(config).toMatchObject({ isEnabled: true, name: 'flashblock' });
  });

  it('keeps the MegaETH name whatever NEXT_PUBLIC_FLASHBLOCKS_NAME says', async() => {
    const config = await loadConfig([
      [ 'NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_RPC', 'wss://localhost:3121' ],
      [ 'NEXT_PUBLIC_FLASHBLOCKS_NAME', 'subblock' ],
    ]);
    expect(config).toMatchObject({ isEnabled: true, type: 'megaEth', name: 'mini-block' });
  });
});

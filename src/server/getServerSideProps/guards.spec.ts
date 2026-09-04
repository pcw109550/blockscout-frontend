// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GetServerSidePropsContext } from 'next';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const SUBBLOCK_NAME: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_FLASHBLOCKS_NAME', 'subblock' ] ];

function makeContext(query: Record<string, string | Array<string>>, resolvedUrl: string, params?: Record<string, string>) {
  return { query: { ...params, ...query }, params, resolvedUrl } as unknown as GetServerSidePropsContext;
}

// the guard reads the frozen app config, so both are imported inside `withEnvs`
async function runBlocksTab(envs: Array<[ string, string ]>, context: GetServerSidePropsContext) {
  return withEnvs(envs, async() => {
    const guards = await import('./guards');
    const config = (await import('src/config')).default;
    return guards.blocksTab(config)(context);
  });
}

describe('blocksTab guard', () => {
  it('does nothing while the feed is disabled', async() => {
    expect(await runBlocksTab([], makeContext({ tab: 'subblocks' }, '/blocks?tab=subblocks'))).toBeUndefined();
  });

  it('lets the canonical tab id through', async() => {
    expect(await runBlocksTab(ENVS_MAP.flashblocks, makeContext({ tab: 'flashblocks' }, '/blocks?tab=flashblocks'))).toBeUndefined();
  });

  it('ignores the other tabs', async() => {
    expect(await runBlocksTab(ENVS_MAP.flashblocks, makeContext({ tab: 'reorgs' }, '/blocks?tab=reorgs'))).toBeUndefined();
    expect(await runBlocksTab(ENVS_MAP.flashblocks, makeContext({}, '/blocks'))).toBeUndefined();
  });

  it('redirects the alias to the canonical id with a temporary redirect', async() => {
    expect(await runBlocksTab(ENVS_MAP.flashblocks, makeContext({ tab: 'subblocks' }, '/blocks?tab=subblocks'))).toEqual({
      redirect: { destination: '/blocks?tab=flashblocks', permanent: false },
    });
  });

  it('follows the configured name in the other direction', async() => {
    const envs = [ ...ENVS_MAP.flashblocks, ...SUBBLOCK_NAME ];
    expect(await runBlocksTab(envs, makeContext({ tab: 'flashblocks' }, '/blocks?tab=flashblocks'))).toEqual({
      redirect: { destination: '/blocks?tab=subblocks', permanent: false },
    });
  });

  it('keeps the other search params and leaves route params in the path', async() => {
    const context = makeContext({ tab: 'subblocks', page: '2' }, '/chain/op/blocks?tab=subblocks&page=2', { chain_slug_or_id: 'op' });
    expect(await runBlocksTab(ENVS_MAP.flashblocks, context)).toEqual({
      redirect: { destination: '/chain/op/blocks?page=2&tab=flashblocks', permanent: false },
    });
  });
});

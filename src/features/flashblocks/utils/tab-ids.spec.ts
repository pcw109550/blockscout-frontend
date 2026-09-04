// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getFlashblocksTabIds } from './tab-ids';

describe('getFlashblocksTabIds', () => {
  it('puts the configured name first and keeps the other OP Stack name as an alias', () => {
    expect(getFlashblocksTabIds('flashblock')).toEqual([ 'flashblocks', 'subblocks' ]);
    expect(getFlashblocksTabIds('subblock')).toEqual([ 'subblocks', 'flashblocks' ]);
  });

  it('gives the MegaETH feed its own id only', () => {
    expect(getFlashblocksTabIds('mini-block')).toEqual([ 'mini-blocks' ]);
  });
});

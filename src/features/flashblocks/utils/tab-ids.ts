// SPDX-License-Identifier: LicenseRef-Blockscout

import type { FlashblocksName } from 'src/features/flashblocks/types/config';
import { FLASHBLOCKS_NAMES } from 'src/features/flashblocks/types/config';

// Blocks-page tab ids of the OP Stack feed, one per operator-selectable name.
const OP_STACK_TAB_IDS: Array<string> = FLASHBLOCKS_NAMES.map((name) => `${ name }s`);

// Tab ids the feed answers to, canonical id first. On OP Stack chains the id for the other
// name is kept as an alias so links written under either name keep resolving; the server-side
// `blocksTab` guard then redirects the alias to the canonical id. MegaETH has its own id only.
export function getFlashblocksTabIds(name: FlashblocksName | 'mini-block'): Array<string> {
  const canonical = `${ name }s`;

  if (!OP_STACK_TAB_IDS.includes(canonical)) {
    return [ canonical ];
  }

  return [ canonical, ...OP_STACK_TAB_IDS.filter((id) => id !== canonical) ];
}

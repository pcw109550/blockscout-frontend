// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import type { Route } from 'nextjs-routes';

import type { RollupType } from 'src/features/rollup/common/types/config';

import type { Props } from 'src/server/getServerSideProps/handlers';

import { getFlashblocksTabIds } from 'src/features/flashblocks/utils/tab-ids';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

export type Guard = (chainConfig: typeof config) => <Pathname extends Route['pathname'] = never>(context: GetServerSidePropsContext) =>
Promise<GetServerSidePropsResult<Props<Pathname>> | undefined>;

export const internalTx: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.slices.internalTx.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const account: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.account.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const accountAuth0: Guard = (chainConfig: typeof config) => async() => {
  const feature = chainConfig.features.account;
  if (!feature.isEnabled || feature.authProvider !== 'auth0') {
    return {
      notFound: true,
    };
  }
};

export const verifiedAddresses: Guard = (chainConfig: typeof config) => async() => {
  if (!getFeaturePayload(chainConfig.features.account)?.verifiedAddresses?.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const userOps: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.userOps.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const marketplace: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.marketplace.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const marketplaceEssentialDapp: Guard = (chainConfig: typeof config) => async() => {
  const feature = chainConfig.features.marketplace;
  if (!feature.isEnabled || !feature.essentialDapps) {
    return {
      notFound: true,
    };
  }
};

export const apiDocs: Guard = (chainConfig: typeof config) => async() => {
  const feature = getFeaturePayload(chainConfig.features.apiDocs);
  if (!feature || feature.mode === 'external') {
    return {
      notFound: true,
    };
  }
};

export const stats: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.stats.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const suave: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.suave.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const nameServiceEns: Guard = (chainConfig: typeof config) => async() => {
  const feature = chainConfig.features.nameServices;
  if (!feature.isEnabled || !feature.ens.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const nameServiceClusters: Guard = (chainConfig: typeof config) => async() => {
  const feature = chainConfig.features.nameServices;
  if (!feature.isEnabled || !feature.clusters.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const accounts: Guard = (chainConfig: typeof config) => async() => {
  if (chainConfig.slices.address.hiddenViews?.top_accounts) {
    return {
      notFound: true,
    };
  }
};

export const accountsLabelSearch: Guard = (chainConfig: typeof config) => async(context) => {
  if (!chainConfig.features.addressMetadata.isEnabled || !context.query.tagType) {
    return {
      notFound: true,
    };
  }
};

export const validators: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.validators.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const validatorDetails: Guard = (chainConfig: typeof config) => async() => {
  const feature = chainConfig.features.validators;
  if (!feature.isEnabled || feature.chainType !== 'zilliqa') {
    return {
      notFound: true,
    };
  }
};

export const gasTracker: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.gasTracker.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const hotContracts: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.hotContracts.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const advancedFilter: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.advancedFilter.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const dataAvailability: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.dataAvailability.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const login: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.app.isReview && !chainConfig.app.isDev) {
    return {
      notFound: true,
    };
  }
};

export const dev: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.app.isDev) {
    return {
      notFound: true,
    };
  }
};

export const publicTagsSubmit: Guard = (chainConfig: typeof config) => async() => {
  if (!getFeaturePayload(chainConfig.features.addressMetadata)?.isTagSubmitionEnabled) {
    return {
      notFound: true,
    };
  }
};

export const pools: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.dexPools.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const zetaChainCCTX: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.zetachain.isEnabled) {
    return {
      notFound: true,
    };
  }
};

// ROLLUPS
export const rollup: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.rollup.isEnabled) {
    return {
      notFound: true,
    };
  }
};

const DEPOSITS_ROLLUP_TYPES: Array<RollupType> = [ 'optimistic', 'shibarium', 'arbitrum', 'scroll' ];
export const deposits: Guard = (chainConfig: typeof config) => async() => {
  const rollupFeature = chainConfig.features.rollup;
  const beaconChainFeature = chainConfig.features.beaconChain;
  if (
    (!beaconChainFeature.isEnabled || beaconChainFeature.withdrawalsOnly) &&
    !(rollupFeature.isEnabled && DEPOSITS_ROLLUP_TYPES.includes(rollupFeature.type))) {
    return {
      notFound: true,
    };
  }
};

const WITHDRAWALS_ROLLUP_TYPES: Array<RollupType> = [ 'optimistic', 'shibarium', 'arbitrum', 'scroll' ];
export const withdrawals: Guard = (chainConfig: typeof config) => async() => {
  const rollupFeature = chainConfig.features.rollup;
  if (
    !chainConfig.features.beaconChain.isEnabled &&
    !(rollupFeature.isEnabled && WITHDRAWALS_ROLLUP_TYPES.includes(rollupFeature.type))
  ) {
    return {
      notFound: true,
    };
  }
};

const BATCH_ROLLUP_TYPES: Array<RollupType> = [ 'zkSync', 'arbitrum', 'optimistic', 'scroll' ];
export const batch: Guard = (chainConfig: typeof config) => async() => {
  const rollupFeature = chainConfig.features.rollup;
  if (!(rollupFeature.isEnabled && BATCH_ROLLUP_TYPES.includes(rollupFeature.type))) {
    return {
      notFound: true,
    };
  }
};

export const batchCelestia: Guard = (chainConfig: typeof config) => async() => {
  const rollupFeature = chainConfig.features.rollup;
  if (!(rollupFeature.isEnabled && (rollupFeature.type === 'arbitrum' || rollupFeature.type === 'optimistic'))) {
    return {
      notFound: true,
    };
  }
};

export const txnWithdrawals: Guard = (chainConfig: typeof config) => async() => {
  const rollupFeature = chainConfig.features.rollup;
  if (!(rollupFeature.isEnabled && rollupFeature.type === 'arbitrum')) {
    return {
      notFound: true,
    };
  }
};

export const outputRoots: Guard = (chainConfig: typeof config) => async() => {
  const rollupFeature = chainConfig.features.rollup;
  if (!(rollupFeature.isEnabled && rollupFeature.outputRootsEnabled)) {
    return {
      notFound: true,
    };
  }
};

export const disputeGames: Guard = (chainConfig: typeof config) => async() => {
  if (!getFeaturePayload(chainConfig.features.rollup)?.faultProofSystemEnabled) {
    return {
      notFound: true,
    };
  }
};

export const tac: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.tac.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const celo: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.celo.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const interopMessages: Guard = (chainConfig: typeof config) => async() => {
  const rollupFeature = chainConfig.features.rollup;
  if (!rollupFeature.isEnabled || !rollupFeature.interopEnabled) {
    return {
      notFound: true,
    };
  }
};

export const crossChainTxs: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.crossChainTxs.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const multichain: Guard = () => async() => {
  if (!config.features.multichain.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const notMultichain: Guard = () => async() => {
  if (config.features.multichain.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const megaEth: Guard = () => async() => {
  if (!config.features.megaEth.isEnabled) {
    return {
      notFound: true,
    };
  }
};

// On OP Stack chains the flashblocks feed answers to two tab ids, `flashblocks` and `subblocks`
// (see NEXT_PUBLIC_FLASHBLOCKS_NAME). A link written under the other name is sent to the
// canonical id. The redirect is temporary because the operator can flip the name later.
export const blocksTab: Guard = (chainConfig: typeof config) => async(context) => {
  const feature = chainConfig.features.flashblocks;
  if (!feature.isEnabled) {
    return;
  }

  const tab = context.query.tab;
  if (typeof tab !== 'string') {
    return;
  }

  const [ canonicalTabId, ...aliasTabIds ] = getFlashblocksTabIds(feature.name);
  if (!aliasTabIds.includes(tab)) {
    return;
  }

  // keep the other search params; dynamic route params also live in `query` but belong to the path
  const routeParams = Object.keys(context.params ?? {});
  const searchParams = new URLSearchParams();
  for (const [ key, value ] of Object.entries(context.query)) {
    if (key === 'tab' || value === undefined || routeParams.includes(key)) {
      continue;
    }
    for (const item of Array.isArray(value) ? value : [ value ]) {
      searchParams.append(key, item);
    }
  }
  searchParams.set('tab', canonicalTabId);

  const pathname = context.resolvedUrl.split('?')[0];

  return {
    redirect: {
      destination: `${ pathname }?${ searchParams.toString() }`,
      permanent: false,
    },
  };
};

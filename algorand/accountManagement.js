import { algoIndexerClient } from "./config.js";

const assetId = parseInt("6670024", 10);

export async function getUserTokenHolding(address) {
  try {
    const response = await algoIndexerClient.lookupAssetBalances(assetId).do();
    for (let balanceInfo of response.balances) {
      if (balanceInfo.address === address) {
        return balanceInfo.amount;
      }
    }
    return 0;
  } catch (error) {
    console.error("Error fetching user token balance:", error);
    return 0;
  }
}
export async function verifyNFT(address, assetID) {
  try {
    if (isNaN(assetID)) {
      return false;
    }
    // Fetch user account information
    let accountAssets = await algoIndexerClient
      .lookupAccountAssets(address)
      .do();

    // Check if the user owns any of the creator's assets
    if (accountAssets.assets) {
      for (let asset of accountAssets.assets) {
        if (asset["asset-id"] === parseInt(assetID)) {
          return true; // The account owns the asset
        }
      }
    }

    return false; // The user does not own any of the creator's assets
  } catch (error) {
    console.error("AlgoSDK error: ", error);
    // Propagate the error up to the caller
    return false;
  }
}

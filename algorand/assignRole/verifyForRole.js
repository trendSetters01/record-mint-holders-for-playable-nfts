import { algoIndexerClient } from "../config.js";

const phantomV1Address =
  "IWY24Q6GUUIMJITMTR3FDO4Q54UCBPPPIWJUQ57CWLASPRHFHXTXIQUQYA";

async function verifyNFT(address, role) {
  try {
    let userAssets = await getAllAssetsForAccount(address);
    const userAssetIds = userAssets.map((asset) => asset["asset-id"]);

    const phantomAssets = await getAllAssetsForAccount(phantomV1Address);
    const phantomAssetIds = phantomAssets.map((asset) => asset["asset-id"]);

    // Count how many of the phantom assets the user owns
    let count = 0;
    for (let assetId of userAssetIds) {
      if (phantomAssetIds.includes(assetId)) {
        count++;
      }
    }
    console.log("count", count);
    // Define the required counts for different roles
    const requiredCounts = {
      Singlev1: 1,
      Fivev1: 5,
      Fourv1: 4,
      Tenv1: 10,
      Fifteenv1: 15,
      Twentyv1: 20,
      // Add more as needed
    };

    // Check if the user meets the requirement
    if (count >= requiredCounts[role]) {
      return true; // The user owns the required number of phantom NFTs for this role
    }

    return false; // The user does not meet the requirement
  } catch (error) {
    console.error("AlgoSDK error: ", error);
    return false; // Handle the error appropriately
  }
}

async function getAllAssetsForAccount(address) {
  let assets = [];
  let nextToken = null;

  try {
    do {
      const response = await algoIndexerClient
        .lookupAccountAssets(address)
        .nextToken(nextToken)
        .do();

      assets = assets.concat(response.assets);
      nextToken = response["next-token"];
    } while (nextToken);
  } catch (error) {
    console.error("Error fetching assets for account:", error);
  }

  return assets;
}

export { verifyNFT };

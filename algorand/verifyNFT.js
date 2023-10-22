import { algoIndexerClient } from "./config.js";
import { v1NFTs } from "./phantomAssets/NFTs/v1.js";

export async function verifyNFT(address) {
  try {
    // Fetch user account information
    let accountAssets = await getAllAssetsForAccount(address);

    // Extract the list of asset IDs the user owns
    const userAssetIds = accountAssets.map((asset) => asset["asset-id"]);

    // Check if the user owns any of the NFTs from the v1NFTs list
    for (let nft of v1NFTs) {
      // console.log("nft", nft);
      if (userAssetIds.includes(nft["asset-id"])) {
        return true; // The user owns one of the NFTs
      }
    }

    return false; // The user does not own any of the NFTs
  } catch (error) {
    console.error("AlgoSDK error: ", error);
    return false; // Handle the error appropriately
  }
}

async function getAllAssetsForAccount(address) {
  let assets = [];
  let nextToken = null;

  do {
    // Fetch the assets for the account
    const response = await algoIndexerClient
      .lookupAccountAssets(address)
      .nextToken(nextToken)
      .do();

    // Add the newly fetched assets to your array
    assets = assets.concat(response.assets);

    // Check if there are more assets to fetch
    nextToken = response["next-token"]; // Check the actual field name for the token in the response you receive
  } while (nextToken); // If there's no next token, we've fetched all assets

  return assets;
}

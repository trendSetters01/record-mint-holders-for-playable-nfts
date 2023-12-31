import { algoIndexerClient, algodClient } from "./config.js";

const phantomV1Address =
  "IWY24Q6GUUIMJITMTR3FDO4Q54UCBPPPIWJUQ57CWLASPRHFHXTXIQUQYA";

export async function verifyNFT(address, assetId) {
  const fetchAssetCount = async (assetId) => {
    try {
      const accountAssetInformation = await algodClient
        .accountAssetInformation(`${address}`.trim(), `${assetId}`.trim())
        .do();

      return accountAssetInformation["asset-holding"]?.amount || 0;
    } catch (error) {
      console.error(
        `Error fetching asset count for asset ID ${assetId}:`,
        error
      );
      throw error; // Rethrow the error to be caught by the outer catch block
    }
  };

  try {
    const phantomNFTAssetID = assetId ? parseInt(assetId, 10) : 1279721720;
    const assetCount = await fetchAssetCount(phantomNFTAssetID);
    return phantomNFTAssetID === 1279721720
      ? assetCount/100000000 > 3400
      : assetCount > 0;
  } catch (error) {
    console.error("AlgoSDK error: ", error);
    return false; // Handle the error appropriately
  }
}

export async function verifySpecificPhntmNFT(address, assetids) {
  try {
    // Check if all the assetids matches against any of the NFTs from the phantomAssets list
    const ownsNFT = await checkPhantomNFT(assetids);
    if (!ownsNFT) {
      return false; // The assedids does not match any phantom NFTs
    }

    // Fetch user account information
    let accountAssets = await getAllAssetsForAccount(address);

    // Extract the list of asset IDs the user owns
    const userAssetIds = accountAssets.map((asset) => asset["asset-id"]);

    // Check if the user owns all the specified NFTs
    const ownsAllNFTs = assetids.every((assetId) =>
      userAssetIds.includes(parseInt(assetId, 10))
    );
    return ownsAllNFTs; // Returns true if the user owns all specified NFTs, false otherwise
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
      // Fetch the assets for the account
      const response = await algoIndexerClient
        .lookupAccountAssets(address)
        .nextToken(nextToken)
        .do();

      // Add the newly fetched assets to your array
      assets = assets.concat(response.assets);

      // Check if there are more assets to fetch
      nextToken = response["next-token"];
    } while (nextToken); // If there's no next token, we've fetched all assets
  } catch (error) {
    console.error("Error fetching assets for account:", error);
  }

  return assets;
}

async function checkPhantomNFT(assetids) {
  // Fetch user account information
  const phantomAssets = await getAllAssetsForAccount(phantomV1Address);

  // Create a set of asset IDs from phantomAssets for efficient lookup
  const phantomAssetIDs = new Set(phantomAssets.map((nft) => nft["asset-id"]));

  // Check if every asset ID in assetids is part of phantomAssets
  return assetids.every((assetid) =>
    phantomAssetIDs.has(parseInt(assetid, 10))
  );
}

let userNFTChoice = {};
let userNFTAssetID = {};

export function getuserNFTChoice(userId) {
  return userNFTChoice[userId];
}

export function setuserNFTChoice(userId, choice) {
  userNFTChoice[userId] = choice;
}


export function getuserNFTAssetID(userId) {
  return userNFTAssetID[userId];
}

export function setuserNFTAssetID(userId, assetID) {
  userNFTAssetID[userId] = assetID;
}


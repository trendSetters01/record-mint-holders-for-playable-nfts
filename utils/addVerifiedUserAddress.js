import fs from "fs/promises";
import path from "path";

async function addVerifiedUserAddress(userAddress) {
  // Specify the directory path
  const dirPath = path.resolve("algorand", "phantomAssets", "addresses");
  const filePath = path.join(dirPath, "phantomVerifiedUserAddresses.txt");

  try {
    // Check if the directory exists; if not, it will throw an error
    await fs.access(dirPath);

    // Read the current contents of the file
    const data = await fs.readFile(filePath, "utf8");

    // Split the contents by new line and remove any carriage return characters
    const addresses = data
      .split("\n")
      .map((address) => address.trim().replace("\r", ""));
    // Check if the address already exists in the array
    if (!addresses.includes(userAddress.trim())) {
      // Address doesn't exist, so append it to the file
      await fs.appendFile(filePath, `\n${userAddress}`);
      console.log("The nft verified address was appended to the file!");
    } else {
      console.log(
        "handleNFTVerification: The nft verified address already exists in the file. No action taken."
      );
    }
  } catch (error) {
    console.error(
      "handleNFTVerification: Error handling the NFT verified address registration:",
      error
    );
  }
}

export { addVerifiedUserAddress };

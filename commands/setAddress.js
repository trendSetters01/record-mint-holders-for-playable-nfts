export default {
  name: "setaddress",
  description: "Register your Algorand address and verify your NFT (enter your asset id for Phantom Pals NFT)",
  options: [
    {
      name: "address",
      type: 3,
      description: "Your Algorand address",
      required: true,
    },
    {
      name: "assetid",
      type: 3,
      description: "Phantom Pals (V1) NFT asset ID",
      required: false,
    },
  ],
};

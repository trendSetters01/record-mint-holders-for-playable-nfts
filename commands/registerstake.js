export default {
  name: "registerstake",
  description: "Register your NFT('s) for staking (Max 5 NFT's)",
  options: [
    {
      name: "address",
      type: 3, // String type
      description: "Your Algorand address",
      required: true,
    },
    {
      name: "durationtype",
      type: 3, // String type
      description: "The unit of duration (e.g., days, weeks, months)",
      required: true,
      choices: [
        {
          name: "days",
          value: "days",
        },
        {
          name: "weeks",
          value: "weeks",
        },
        {
          name: "months",
          value: "months",
        },
      ],
    },
    {
      name: "duration",
      type: 4, // Integer type
      description: "Staking duration",
      required: true,
    },
    {
      name: "assetid1",
      type: 3, // String type
      description: "The Asset ID of your NFT",
      required: true,
    },
    {
      name: "assetid2",
      type: 3, // String type
      description: "The Asset ID of your NFT",
      required: false,
    },
    {
      name: "assetid3",
      type: 3, // String type
      description: "The Asset ID of your NFT",
      required: false,
    },
    {
      name: "assetid4",
      type: 3, // String type
      description: "The Asset ID of your NFT",
      required: false,
    },
    {
      name: "assetid5",
      type: 3, // String type
      description: "The Asset ID of your NFT",
      required: false,
    },
  ],
};

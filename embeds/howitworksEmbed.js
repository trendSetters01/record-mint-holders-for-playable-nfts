import { EmbedBuilder } from "discord.js";

function createHowItWorksEmbed() {
  return new EmbedBuilder()
    .setColor("#0099FF")
    .setTitle("Understanding Your Phantom V2 NFT Rewards")
    .setDescription(
      "Welcome to the mystical journey of Phantoms! To make your experience smooth, here are some crucial points to understand about your Phantom V2 NFT and the reward system:"
    )
    .addFields(
      {
        name: "🔹 One Phantom, One Reward",
        value:
          "For every Phantom NFT you hold, you are eligible for one unique reward. It’s important to note that owning multiple Phantom V2 nft in one Algorand address doesn't equate to multiple rewards. Why? It’s about fairness and ensuring every member of our community gets a slice of the adventure. It keeps things exclusive and exciting for everyone!",
      },
      {
        name: "🔹 Verification of Ownership",
        value:
          "Ownership verification is a crucial step. By registering your Algorand address with us, you help us confirm your NFT ownership. This process is seamless but necessary to proceed.",
      },
      {
        name: "🔹 Choose Your Reward Destination",
        value:
          "Upon successful verification, you have the freedom to choose between a Matic or Cardano wallet for receiving your reward. Your preference matters, and we want to deliver the reward where it’s most convenient for you.",
      },
      {
        name: "🔹 Manual Reward Distribution",
        value:
          "We value your participation and excitement! That's why our team is meticulously handling the reward distribution process manually. This attention to detail ensures that every rightful NFT owner receives their due reward.",
      },
      {
        name: "🔹 Community and Beyond",
        value:
          "While the reward is a thrilling part of your journey, we invite you to explore more within our community. Engage in activities, delve into discussions, and be on the lookout for more surprises along the way!",
      },
      {
        name: "Here for You",
        value:
          "Questions? Need help? Don’t hesitate to reach out through the 'questions' channel. Our team is here for you every step of the way.",
      }
    )
    .setFooter({
      text: "Your journey in the realm of Phantoms is filled with wonder. Thank you for being a part of this adventure!",
      iconURL:
        "https://www.randgallery.com/wp-content/uploads/2023/09/54-1.png",
    });
}

export { createHowItWorksEmbed };

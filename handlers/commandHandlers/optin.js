import { EmbedBuilder } from "discord.js";
import QRCode from "qrcode";
import { AttachmentBuilder } from "discord.js";

// Example function to generate a QR Code for a URL
async function generateQRCode(url) {
  try {
    const qrCodeBuffer = await QRCode.toBuffer(url);
    return qrCodeBuffer;
  } catch (err) {
    console.error("Error generating QR Code:", err);
    return null;
  }
}

async function handleOptin(interaction) {
  if (interaction.deferred || interaction.replied) {
    return; // Prevent double replies
  }

  await interaction.deferReply();

  const userId = interaction.user.id;
  const assetId = interaction.options.getString("assetid");

  const url = generateAssetOptInURL(assetId);
  const qrCodeBuffer = await generateQRCode(url);

  if (qrCodeBuffer) {
    const attachment = new AttachmentBuilder(qrCodeBuffer, "qrcode.png");
    await interaction.followUp({ files: [attachment] });

    const qrCodeEmbed = new EmbedBuilder()
      .setColor(16711680)
      .setImage(`attachment://qrcode.png`)
      .setTitle("Opt-in via QR Code")
      .setDescription(
        `If needed you can [Click here to opt-in](https://phantoms-ashy.vercel.app/opt-in/${assetId}), on your mobile device. This will open the Perawallet app and prompt you to opt-in to the asset.`
      );
      
    

    await interaction.followUp({ embeds: [qrCodeEmbed] });
  } else {
    // Handle the case when QR code generation fails
    await interaction.followUp({ content: "Failed to generate QR code." });
  }
}

function generateAssetOptInURL(assetId) {
  return `perawallet://?amount=0&asset=${assetId}`;
}

export { handleOptin };

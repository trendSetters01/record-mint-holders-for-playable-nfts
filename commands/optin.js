export default {
  name: 'optin',
  description: 'Asset opt-in via QR Code for Perawallet',
  options: [
    {
      name: "assetid",
      type: 3,
      description: "Asset ID to opt-in to",
      required: true,
    },
  ],
}
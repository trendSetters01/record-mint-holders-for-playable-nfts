import { User, AddressSet } from "../models/index.js";
import {
  userAddressRegistration,
  addVerifiedUserAddress,
} from "../../utils/index.js";

async function createUserOrUpdateAddressSet(userId, userAddress, transaction) {
  const [user, created] = await User.findOrCreate({
    where: { userId: userId },
    transaction: transaction,
  });

  if (!user) return null;

  const [addressSet, wasCreated] = await AddressSet.findOrCreate({
    where: { userId: user.id, algorandAddress: userAddress },
    defaults: { algorandAddress: userAddress },
    transaction: transaction,
  });

  if (!wasCreated) {
    addressSet.algorandAddress = userAddress;
    await addressSet.save({ transaction: transaction });
  }

  await transaction.commit();
  await userAddressRegistration(userId, userAddress);
  await addVerifiedUserAddress(userAddress);

  return user;
}

export { createUserOrUpdateAddressSet };

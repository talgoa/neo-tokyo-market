Moralis.Cloud.define("checkCitizenship", async (request) => {
  UpdateUserCitizenship(request.user);
});

Moralis.Cloud.beforeSave(Moralis.User, async (request) => {
  logger.info("Triggered b1 " + request.object.get("ethAddress"));
  UpdateUserCitizenship(request.object);
});

async function UpdateUserCitizenship(user) {
  const ethAddress = user.get("ethAddress");
  if (ethAddress !== undefined) {
    const citizenship = await CheckCitizenship(ethAddress);
    logger.info("User " + ethAddress + " - " + citizenship);
    if (citizenship) {
      AddCitizenship(user);
    } else {
      RemoveCitizenship(user);
    }
  }
}

async function CheckCitizenship(address) {
  logger.info("checking presence of NFT for " + address);
  const options = {
    chain: "eth",
    address: address,
    token_address: "0x86357a19e5537a8fba9a004e555713bc943a66c0",
  };
  const identities = await Moralis.Web3API.account.getNFTsForContract(options);
  return identities.total > 0;
}

async function AddCitizenship(user) {
  const query = new Moralis.Query("_Role");
  query.equalTo("name", "Citizen");
  const roles = await query.find();
  const role = roles[0];

  logger.info("Found user " + user);
  logger.info("Found role " + role.id);

  role.getUsers().add(user);

  role.save();
}

async function RemoveCitizenship(user) {
  const query = new Moralis.Query("_Role");
  query.equalTo("name", "Citizen");
  const roles = await query.find();
  const role = roles[0];

  logger.info("Found user " + user);
  logger.info("Found role " + role.id);

  role.getUsers().remove(user);

  role.save();
}

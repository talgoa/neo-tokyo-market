const logger = Moralis.Cloud.getLogger();

Moralis.Cloud.define("identities", async (request) => {
  const result = await getIdentities(request.params.ethAddress);

  return result;
});

Moralis.Cloud.define("vaults", async (request) => {
  const result = getVaults(request.params.ethAddress);

  return result;
});

Moralis.Cloud.define("itemCaches", async (request) => {
  const results = getItemCaches(request.params.ethAddress);

  return results;
});

async function getIdentities(ethAddress) {
  const nfts = await getNfts(
    ethAddress,
    "0x86357a19e5537a8fba9a004e555713bc943a66c0"
  );
  const ids = nfts.result.map((nft) => parseInt(nft.token_id));

  const query = new Moralis.Query("Identity");
  query.containedIn("identityId", ids);
  return await query.find();
}

async function getVaults(ethAddress) {
  const nfts = await getNfts(
    ethAddress,
    "0xab0b0dd7e4eab0f9e31a539074a03f1c1be80879"
  );
  const ids = nfts.result.map((nft) => parseInt(nft.token_id));

  const query = new Moralis.Query("Vault");
  query.containedIn("vaultId", ids);
  return await query.find();
}

async function getItemCaches(ethAddress) {
  const nfts = await getNfts(
    ethAddress,
    "0x0938e3f7ac6d7f674fed551c93f363109bda3af9"
  );
  const ids = nfts.result.map((nft) => parseInt(nft.token_id));

  const query = new Moralis.Query("ItemCache");
  query.containedIn("itemCacheId", ids);
  return await query.find();
}

async function getNfts(ethAddress, contract) {
  const options = {
    chain: "eth",
    address: ethAddress,
    token_address: contract,
  };
  const identities = await Moralis.Web3API.account.getNFTsForContract(options);
  return identities;
}

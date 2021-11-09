
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

Moralis.Cloud.job("UpdateIdentityPrices", (request) => {
  // params: passed in the job call
  // headers: from the request that triggered the job
  // log: the Moralis Server logger passed in the request
  // message: a function to update the status message of the job object
  const { params, headers, log, message } = request;
  message("I just started " + JSON.stringify(params));
  return updateIdentities(50, message);
});

async function updateIdentities(number, message) {
  const Identity = Moralis.Object.extend("Identity");
  const query = new Moralis.Query(Identity);
  query.ascending("updatedAt");
  query.limit(number);

  const identities = await query.find();
  
  for (const identity of identities) {
    const identityId = identity.get("identityId");
    const asset = await Asset(Moralis, "0x86357a19e5537a8fba9a004e555713bc943a66c0", identityId);
    const price = PriceOfAsset(asset);
    //const price = await getAssetPrice("0x86357a19e5537a8fba9a004e555713bc943a66c0", identityId);

    identity.set("price", price);

    const openedBox = await identityBoxOpened(identityId);
    identity.set("openedBox", parseInt(openedBox));
    message("did set openedBox for identity " + identityId + " : " + openedBox);
     
    identity.save(null, { useMasterKey: true });
    await delay(1000);
  }

  message("Finished " + number);
}

Moralis.Cloud.job("UpdateVaultsPrices", (request) => {
    const { params, headers, log, message } = request;
    message("I just started " + JSON.stringify(params));
    return updateVaults(50, message);
  });

async function updateVaults(number, message) {
    const Vault = Moralis.Object.extend("Vault");
    const query = new Moralis.Query(Vault);
    query.ascending("updatedAt");
    query.limit(number);
  
    const vaults = await query.find();
    
    for (const vault of vaults) {
      const vaultId = vault.get("vaultId");
      const asset = await Asset(Moralis, "0xab0b0dd7e4eab0f9e31a539074a03f1c1be80879", vaultId);
      const price = PriceOfAsset(asset);
      //const price = await getAssetPrice("0xab0b0dd7e4eab0f9e31a539074a03f1c1be80879", vaultId);
  
      vault.set("price", price);

      const openedBy = await vaultBoxOpenedByIdentity(vaultId);
      vault.set("openedBy", parseInt(openedBy));

      const claimedBox = await itemCacheClaimedByVault(vaultId);
      vault.set("claimedBox", parseInt(claimedBox))
      message("did set claimed box for vault " + vaultId + " : " + claimedBox);

      vault.save(null, { useMasterKey: true });
      await delay(1000);
    }
  }

  Moralis.Cloud.job("UpdateItemCachesPrices", (request) => {
      const { params, headers, log, message } = request;
      message("I just started " + JSON.stringify(params));
      return updateItemCaches(50, message);
    });
  
  async function updateItemCaches(number, message) {
      const ItemCache = Moralis.Object.extend("ItemCache");
      const query = new Moralis.Query(ItemCache);
      query.ascending("updatedAt");
      query.limit(number);
    
      const itemCaches = await query.find();
      
      for (const itemCache of itemCaches) {
        const asset = await Asset(Moralis, "0x0938e3f7ac6d7f674fed551c93f363109bda3af9", itemCache.get("itemCacheId"));
        const price = PriceOfAsset(asset);
        //const price = await getAssetPrice("0x0938e3f7ac6d7f674fed551c93f363109bda3af9", itemCache.get("itemCacheId"));
    
        itemCache.set("price", price);
        itemCache.save(null, { useMasterKey: true });
  
        message("did set price " + itemCache.get("itemCacheId") + " " + price)
        await delay(1000);
      }
    }

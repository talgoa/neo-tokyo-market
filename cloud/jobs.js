
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
  query.ascending("lastUpdate");
  query.limit(number);

  const identities = await query.find();
  
  for (const identity of identities) {
    const asset = await Asset(Moralis, "0x86357a19e5537a8fba9a004e555713bc943a66c0", identity.get("identityId"));
    const price = PriceOfAsset(asset);
    //const price = await getAssetPrice("0x86357a19e5537a8fba9a004e555713bc943a66c0", identity.get("identityId"));

    identity.set("price", price);
    identity.set("lastUpdate", new Date());
    identity.save();

    message("did set price " + identity.get("identityId") + " " + price)
    await delay(1000);
  }

  message("Finished " + number);
}

Moralis.Cloud.job("UpdateItemCachesPrices", (request) => {
    // params: passed in the job call
    // headers: from the request that triggered the job
    // log: the Moralis Server logger passed in the request
    // message: a function to update the status message of the job object
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
      itemCache.save();

      message("did set price " + itemCache.get("itemCacheId") + " " + price)
      await delay(1000);
    }
  }

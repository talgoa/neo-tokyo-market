import React from "react";
import { useMoralis } from "react-moralis";
import { getAssetPrice } from "../openseaApi/openseaApi.js";
import text from "../resources/Characters.js";
import textItemCaches from "../resources/ItemCaches.js";

export default function Admin() {
  const { Moralis, isInitialized } = useMoralis();

  function clickUpdateAllPrices() {
    updatePrices(Moralis, 500);
  }

  function clickUpdateAllCachePrices() {
    updateCachePrices(Moralis, 500);
  }

  function clickUpdateAllIdentities() {
    updateAllIdentities(Moralis);
  }

  function clickUpdateAllItemCaches() {
    updateAllItemCaches(Moralis);
  }

  if (isInitialized) {
    return (
      <div>
      <div>
        <button onClick={clickUpdateAllPrices}>Update all prices</button>
      </div>
        <div>
          <button onClick={clickUpdateAllCachePrices}>Update all cache prices</button>
        </div>
        <div>
          <button onClick={clickUpdateAllIdentities}>
            Update all identities
          </button>
        </div>
        <div>
          <button onClick={clickUpdateAllItemCaches}>
            Update all item caches
          </button>
        </div>
      </div>
    );
  }

  return <div>Admin!</div>;
}

async function updatePrices(Moralis, number) {
  const Identity = Moralis.Object.extend("Identity");
  const query = new Moralis.Query(Identity);
  query.ascending("lastUpdate");
  query.limit(number);

  const identities = await query.find();
  for (const i in identities) {
    const price = await getAssetPrice("0x86357a19e5537a8fba9a004e555713bc943a66c0", identities[i].get("identityId"));

    identities[i].set("price", price);
    identities[i].set("lastUpdate", new Date());
    identities[i].save();
  }
}

async function updateCachePrices(Moralis, number) {
  const ItemCache = Moralis.Object.extend("ItemCache");
  const query = new Moralis.Query(ItemCache);
  query.ascending("updatedAt");
  query.limit(number);

  const itemCache = await query.find();
  for (const i in itemCache) {
    const price = await getAssetPrice("0x0938e3f7ac6d7f674fed551c93f363109bda3af9", itemCache[i].get("itemCacheId"));

    itemCache[i].set("price", price);
    itemCache[i].save();
  }
}

async function updateAllIdentities(Moralis) {
  const allIdentites = text;

  const identities = allIdentites.split("\n");

  var index = 1;

  for (const identityCsv of identities) {
    console.log("Parsing " + identityCsv);
    const attributes = identityCsv.split(",");
    const identity = await findOrCreateIdentity(Moralis, index);

    identity.set("class", attributes[2]);
    identity.set("gender", attributes[3]);
    identity.set("race", attributes[4]);
    identity.set("ability", attributes[5]);
    identity.set("eyes", attributes[6]);
    identity.set("strength", parseInt(attributes[7]));
    identity.set("intelligence", parseInt(attributes[8]));
    identity.set("attractiveness", parseInt(attributes[9]));
    identity.set("techSkill", parseInt(attributes[10]));
    identity.set("cool", parseInt(attributes[11]));
    identity.set("credits", parseInt(attributes[12]));
    identity.set("creditYield", attributes[13]);
    identity.set("openedVault", attributes[14] === "True");
    identity.set("rarity", parseInt(attributes[15]));

    identity.save();
    index++;
  }
}

async function updateAllItemCaches(Moralis) {
  const allItemCaches = textItemCaches;

  const itemCaches = allItemCaches.split("\n");

  for (const itemCacheCsv of itemCaches) {
    console.log("Parsing " + itemCacheCsv);
    const attributes = itemCacheCsv.split(",");
    const itemCache = await findOrCreateItemCache(
      Moralis,
      parseInt(attributes[0])
    );

    var rarity = parseInt(attributes[5]);
    if (rarity === 2147483647) {
      rarity = null;
    }

    itemCache.set("weapon", attributes[1]);
    itemCache.set("apparel", attributes[2]);
    itemCache.set("vehicle", attributes[3]);
    itemCache.set("helm", attributes[4]);
    itemCache.set("rarity", rarity);

    itemCache.save();
  }
}

async function findOrCreateIdentity(Moralis, id) {
  const Identity = Moralis.Object.extend("Identity");
  const query = new Moralis.Query(Identity);
  query.equalTo("identityId", id);
  var identity = await query.first();
  if (identity == null) {
    identity = new Identity();
    identity.set("identityId", id);
  }
  return identity;
}

async function findOrCreateItemCache(Moralis, id) {
  const ItemCache = Moralis.Object.extend("ItemCache");
  const query = new Moralis.Query(ItemCache);
  query.equalTo("itemCacheId", id);
  var itemCache = await query.first();
  if (itemCache == null) {
    itemCache = new ItemCache();
    itemCache.set("itemCacheId", id);
  }
  return itemCache;
}

import React from "react";
import { useMoralis } from "react-moralis";
import text from "../resources/Characters.js";

export default function Admin() {
  const { Moralis, isInitialized } = useMoralis();

  function clickUpdateAllPrices() {
    updatePrices(Moralis, 200);
  }

  function clickUpdateAllIdentities() {
    updateAllIdentities(Moralis);
  }

  if (isInitialized) {
    return (
      <div>
        <div>
          <button onClick={clickUpdateAllPrices}>Update all prices</button>
        </div>
        <div>
          <button onClick={clickUpdateAllIdentities}>
            Update all identities
          </button>
        </div>
      </div>
    );
  }

  return <div>Admin!</div>;
}

/*async function updateAllPrices(Moralis) {
  for (var i = 1290; i <= 2500; i++) {
    const Identity = Moralis.Object.extend("Identity");
    const query = new Moralis.Query(Identity);
    query.equalTo("identityId", i);
    var identity = await query.first();
    if (identity == null) {
      console.log("Identity " + i + " not found");
      continue;
    }

    const asset = await Asset(Moralis, i);
    const price = PriceOfAsset(asset);

    identity.set("price", price);
    identity.set("lastUpdate", new Date());
    identity.save();
  }
}*/

async function updatePrices(Moralis, number) {
  const Identity = Moralis.Object.extend("Identity");
  const query = new Moralis.Query(Identity);
  query.ascending("lastUpdate");
  query.limit(number);

  const identities = await query.find();
  for (const i in identities) {
    const asset = await Asset(Moralis, identities[i].get("identityId"));
    const price = PriceOfAsset(asset);

    identities[i].set("price", price);
    identities[i].set("lastUpdate", new Date());
    identities[i].save();
  }
}

async function Asset(Moralis, id) {
  if (Moralis.Plugins === undefined) {
    return null;
  }

  var asset = await Moralis.Plugins.opensea.getOrders({
    network: "mainnet",
    tokenAddress: "0x86357a19e5537a8fba9a004e555713bc943a66c0",
    tokenId: id,
    page: 1,
  });
  console.log("Found orders for " + id + " : " + asset);

  return asset;
}

function PriceOfAsset(asset) {
  if (asset.orders[0] === undefined) {
    return null;
  }

  if (asset.orders[0].expirationTime + "00" > Date.now().toString()) {
    const price = asset.orders[0].basePrice / 1000000000000000000;
    console.log("Found price: " + price);
    if (asset.orders[0].waitingForBestCounterOrder) {
      console.log("This is a bet, ignoring.");
      return null;
    }
    return price;
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

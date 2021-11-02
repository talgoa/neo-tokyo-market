Moralis.Cloud.job("UpdateIdentityPrices", (request) => {
  // params: passed in the job call
  // headers: from the request that triggered the job
  // log: the Moralis Server logger passed in the request
  // message: a function to update the status message of the job object
  const { params, headers, log, message } = request;
  message("I just started " + JSON.stringify(params));
  // return updateIdentities(params.number, message);
});

async function updateIdentities(number, message) {
  const Identity = Moralis.Object.extend("Identity");
  const query = new Moralis.Query(Identity);
  query.ascending("lastUpdate");
  query.limit(number);

  const identities = await query.find();
  

  message("Did find identities " + identities.length);
  for (const i in identities) {
    const asset = await Asset(Moralis, identities[i].get("identityId"), message);
    const price = PriceOfAsset(asset);

    message("Found price [" + identities[i].get("identityId") + "]: " + price);

    identities[i].set("price", price);
    identities[i].set("lastUpdate", new Date());
    identities[i].save();
  }
}

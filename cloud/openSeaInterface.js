async function Asset(Moralis, id, message) {
  if (Moralis.Plugins === undefined) {
    return null;
  }

  var asset = await Moralis.Plugins.opensea.getOrders({
    network: "mainnet",
    tokenAddress: "0x86357a19e5537a8fba9a004e555713bc943a66c0",
    tokenId: id,
    page: 1,
  });

  return asset;
}

function PriceOfAsset(asset) {
  const orders = asset.data.result.orders;
  if (orders[0] === undefined) {
    return null;
  }

  if (orders[0].expirationTime + "00" > Date.now().toString()) {
    const price = orders[0].basePrice / 1000000000000000000;
    console.log("Found price: " + price);
    if (orders[0].waitingForBestCounterOrder) {
      console.log("This is a bet, ignoring.");
      return null;
    }
    return price;
  }
}

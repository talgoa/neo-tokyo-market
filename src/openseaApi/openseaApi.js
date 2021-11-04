async function getAsset(contract, token) {
  const result = await fetch(
    "https://api.opensea.io/api/v1/asset/" + contract + "/" + token + "/"
  );
  const json = await result.json();

  return json;
}

function currentOrder(orders) {
  const filteredOrders = orders.filter((order) => {
    return order.side === 1 && order.closing_extendable === false && order.expiration_time * 1000 > Date.now();
  });

  const sortedOrders = filteredOrders.sort((a, b) => {
      return a.base_price < b.base_price;
  });

  return sortedOrders[0];
}

export async function getAssetPrice(contract, token) {
  const asset = await getAsset(contract, token);
  const orders = asset.orders;
  const order = currentOrder(orders);

  if (order === undefined) {
      console.log("[" + token + "] No price found.")
      return null;
  }

  const price = order.base_price / 1000000000000000000;
  console.log("[" + token + "] " + price);

  return price;
}

import { Link } from "react-router-dom";

export default function Help() {
  return (
    <div>
      <h1>HELP</h1>
      <h2>Check the rarity of your identity <a href="https://raritymon.com/Collections?collection=neotokyo">here</a></h2>
      <h2>Check if the identity has already opened a vault <a href="https://etherscan.io/address/0x7d647b1A0dcD5525e9C6B3D14BE58f27674f8c95#readContract">here</a></h2>
      <pre>Use the function "8. hasIdentityOpenedABox", enter the ID and press "Query"</pre>
      <Link to="/">Back to homepage -&gt;</Link>
    </div>
  );
}

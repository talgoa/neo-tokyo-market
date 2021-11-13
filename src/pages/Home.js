import { useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { Link } from "react-router-dom";
import styled from "styled-components";

const LinkTo = styled.span`
  margin: 10px;
`;

const LinkContainer = styled.div`
  margin-top: 50px;
`;

const FloorPricesContainer = styled.div`
  margin: 100px;
  width: 100px;
  text-align: left;
`;

const CommentsContainer = styled.div`
  margin: 50px;
  margin-top: 200px;
  text-align: right;
  color: grey;
`;

const TipButton = styled.button`
  margin: 10px;
`;

const News = styled.h2`
  color: orange;
`;

const NewsPre = styled.pre`
  color: orange;
`;

export default function Home() {
  const destinationAddress = "0x753fbe134a7906918Ec18ca2B1107c00d13F79AB";
  const [didTip, setDidTip] = useState(false);
  const { Moralis } = useMoralis();

  async function tip(requiredChainId, requiredChainName, amount) {
    Moralis.enableWeb3().then(async (web3) => {
      const chainId = await web3.eth.getChainId();
      if (chainId !== requiredChainId) {
        window.alert("Please switch to " + requiredChainName + " network.");
        return;
      }

      const transactionObject = {
        from: web3.currentProvider.selectedAddress,
        to: destinationAddress,
        value: amount,
      };
      web3.eth.sendTransaction(transactionObject, (error) => {
        if (error == null) {
          setDidTip(true);
        }
      });
    });
  }

  async function tip001EthClicked() {
    tip(1, "Ethereum", "10000000000000000");
  }

  async function tip5MaticClicked() {
    tip(137, "Polygon", "5000000000000000000");
  }

  async function tip1MaticClicked() {
    tip(137, "Polygon", "1000000000000000000");
  }

  return (
    <div>
      <h1>NEO TOKYO MARKET</h1>
      <News>Important News!</News>
      <NewsPre>
        This website will be discontinued. I will join @JustTheSyme (Citizen
        #1008) who developed{" "}
        <a href="https://neotokyotools.com">neotokyotools.com</a> and try to
        help there.{" "}
      </NewsPre>
      <NewsPre>
        Basically we had the same idea and developped the same kind of website
        at almost the same time...
        <br /> I guess neotokyomarket was a bit faster and more in a "bricolage"
        way while
        <br /> neotokyotools looks better and also works better (data is
        refreshed faster).
      </NewsPre>
      <NewsPre>
        I will keep this website for a few more days, then it will redirect to
        neotokyotools.
        <br />
        Please let me know if there is any feature here that you would be
        missing there.
      </NewsPre>
      <h3>
        Double check the data in official sources before buying on OpenSea!
      </h3>
      <pre>
        Here is <Link to="/help">how to check -&gt;</Link>
      </pre>
      <LinkContainer>
        <LinkTo>
          <Link to="/identities">Identities -&gt;</Link>
        </LinkTo>
        <LinkTo>
          <Link to="/vaults">Vaults -&gt;</Link>
        </LinkTo>
        <LinkTo>
          <Link to="/itemcaches">Item Caches -&gt;</Link>
        </LinkTo>
      </LinkContainer>
      <FloorPricesContainer>
        <pre>
          <b>Floor Prices</b>
        </pre>
        <pre>
          Identity <IdentityFloorPrice />
        </pre>
        <pre>
          Elite Identity <EliteIdentityFloorPrice />
        </pre>
        <pre>
          Vault <VaultFloorPrice />
        </pre>
        <pre>
          Unopened Vault <UnopenedVaultFloorPrice />
        </pre>
        <pre>
          Item Cache <ItemCacheFloorPrice />
        </pre>
      </FloorPricesContainer>
      <CommentsContainer>
        <pre>
          For suggestions/comments/complaints, you can contact me on Discord
          Talgoa#8526 Citizen #1216
        </pre>
        <pre>
          If you want to support this website (the infrastructure is not
          expensive, but not free), donations are accepted {destinationAddress}{" "}
          (eth, polygon, bsc, avax)
        </pre>
        <TipButton onClick={tip001EthClicked}>Tip 0.01 Eth (~50$)</TipButton>
        <TipButton onClick={tip5MaticClicked}>Tip 5 Matic (~10$)</TipButton>
        <TipButton onClick={tip1MaticClicked}>Tip 1 Matic (~2$)</TipButton>
        {didTip ? <pre>Thank you!</pre> : <pre></pre>}
      </CommentsContainer>
    </div>
  );
}

function IdentityFloorPrice() {
  const { data, error, isLoading } = useMoralisQuery("Identity", (query) =>
    query.notEqualTo("price", null).ascending("price").limit(1)
  );

  if (isLoading) {
    return <pre>loading</pre>;
  }

  if (error) {
    return <pre>Error {error}</pre>;
  }

  console.log(data);

  if (data[0] === undefined) {
    return <pre>not found</pre>;
  }

  return <span>{data[0].get("price")}</span>;
}

function EliteIdentityFloorPrice() {
  const { data, error, isLoading } = useMoralisQuery("Identity", (query) =>
    query
      .notEqualTo("price", null)
      .ascending("price")
      .lessThanOrEqualTo("rarity", 500)
      .limit(1)
  );

  if (isLoading) {
    return <pre>loading</pre>;
  }

  if (error) {
    return <pre>Error {error}</pre>;
  }

  console.log(data);

  if (data[0] === undefined) {
    return <pre>not found</pre>;
  }

  return <span>{data[0].get("price")}</span>;
}

function VaultFloorPrice() {
  const { data, error, isLoading } = useMoralisQuery("Vault", (query) =>
    query.notEqualTo("price", null).ascending("price").limit(1)
  );

  if (isLoading) {
    return <pre>loading</pre>;
  }

  if (error) {
    return <pre>Error {error}</pre>;
  }

  console.log(data);

  if (data[0] === undefined) {
    return <pre>not found</pre>;
  }

  return <span>{data[0].get("price")}</span>;
}

function UnopenedVaultFloorPrice() {
  const { data, error, isLoading } = useMoralisQuery("Vault", (query) =>
    query
      .equalTo("openedBy", 0)
      .notEqualTo("price", null)
      .ascending("price")
      .limit(1)
  );

  if (isLoading) {
    return <pre>loading</pre>;
  }

  if (error) {
    return <pre>Error {error}</pre>;
  }

  console.log(data);

  if (data[0] === undefined) {
    return <pre>not found</pre>;
  }

  return <span>{data[0].get("price")}</span>;
}

function ItemCacheFloorPrice() {
  const { data, error, isLoading } = useMoralisQuery("ItemCache", (query) =>
    query.notEqualTo("price", null).ascending("price").limit(1)
  );

  if (isLoading) {
    return <pre>loading</pre>;
  }

  if (error) {
    return <pre>Error {error}</pre>;
  }

  console.log(data);

  if (data[0] === undefined) {
    return <pre>not found</pre>;
  }

  return <span>{data[0].get("price")}</span>;
}

import { useMoralisCloudFunction } from "react-moralis";
import { Route, Switch, useParams, useRouteMatch } from "react-router";
import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const Container = styled.div`
  margin: 20px;
`;

const Title = styled.h3``;

const Rarity = styled.span`
  color: orange;
`;

const AverageRarity = styled.span`
  color: orange;
  font-weight: bold;
`;

const CheckButton = styled.button`
  background-color: black;
  color: white;
  margin-left: 10px;
`;

export default function Account() {
  let match = useRouteMatch();
  const [ethAddress, setEthAddress] = useState("");

  return (
    <div>
      <PageHeader title="ACCOUNT"/>
      <Switch>
        <Route path={`${match.path}/:ethAddress`}>
          <SpecificAccount />
        </Route>
        <Route path={match.path}>
          <h3>Enter your ETH address.</h3>
          <input
            value={ethAddress}
            label="Enter your name"
            onChange={(e) => {
              setEthAddress(e.target.value);
            }}
          />
          <Link to={`${match.url}/${ethAddress}`} >
            <CheckButton type="button">Check!</CheckButton>
          </Link>
        </Route>
      </Switch>
    </div>
  );
}

function SpecificAccount() {
  let { ethAddress } = useParams();
  const { data: identities } = useMoralisCloudFunction("identities", {
    ethAddress: ethAddress,
  });
  const { data: vaults } = useMoralisCloudFunction("vaults", {
    ethAddress: ethAddress,
  });
  const { data: itemCaches } = useMoralisCloudFunction("itemCaches", {
    ethAddress: ethAddress,
  });

  const identitiesComponent =
    identities === null ? (
      <div>
        <Title>Identities...</Title>
      </div>
    ) : identities[0] === undefined ? (
      <div>
        <Title>Identities: not found</Title>
      </div>
    ) : (
      <div>
        <Title>
          Identities ID <Rarity>Rarity</Rarity>
        </Title>{" "}
        {identities.map((identity) => (
          <div>
            {identity.attributes.identityId}{" "}
            <Rarity>{identity.attributes.rarity}</Rarity>
          </div>
        ))}
      </div>
    );

  const vaultsComponent =
    vaults === null ? (
      <div>
        <Title>Vaults...</Title>
      </div>
    ) : vaults[0] === undefined ? (
      <div>
        <Title>Vaults: not found</Title>
      </div>
    ) : (
      <div>
        <Title>
          Vaults ID <Rarity>Rarity</Rarity>
        </Title>{" "}
        {vaults.map((vault) => (
          <div>
            {vault.attributes.vaultId}{" "}
            <Rarity>{vault.attributes.rarity}</Rarity>
          </div>
        ))}
      </div>
    );

  const itemCachesComponent =
    itemCaches === null ? (
      <div>
        <Title>Item Caches...</Title>
      </div>
    ) : itemCaches[0] === undefined ? (
      <div>
        <Title>Item Caches: not found</Title>
      </div>
    ) : (
      <div>
        <Title>
          Item Caches ID <Rarity>Rarity</Rarity>
        </Title>{" "}
        {itemCaches.map((itemCache) => (
          <div>
            {itemCache.attributes.itemCacheId}{" "}
            <Rarity>{itemCache.attributes.rarity}</Rarity>
          </div>
        ))}
      </div>
    );

  const averageComponent =
    identities === null || vaults === null || itemCaches === null ? (
      <div>
        <Title>Average...</Title>
      </div>
    ) : identities[0] === undefined ||
      vaults[0] === undefined ||
      itemCaches[0] === undefined ? (
      <div>
        <Title>Average: not one of each.</Title>
      </div>
    ) : (
      <div>
        <Title>
          Average <Rarity>Rarity</Rarity>
        </Title>
        <AverageRarity>
          {(identities[0].attributes.rarity +
            vaults[0].attributes.rarity +
            itemCaches[0].attributes.rarity) /
            3}
        </AverageRarity>
      </div>
    );

  return (
    <Container>
      {identitiesComponent}
      {vaultsComponent}
      {itemCachesComponent}
      {averageComponent}
    </Container>
  );
}

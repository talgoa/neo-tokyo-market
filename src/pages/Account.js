import { useMoralisCloudFunction } from "react-moralis";
import { Route, Switch, useParams, useRouteMatch } from "react-router";
import styled from "styled-components";

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

export default function Account() {
  let match = useRouteMatch();

  return (
    <div>
      <h2>Account</h2>
      <Switch>
        <Route path={`${match.path}/:ethAddress`}>
          <SpecificAccount />
        </Route>
        <Route path={match.path}>
          <h3>Enter your ETH address.</h3>
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

  if (vaults !== null) {
    console.log("did get vaults!!");
  }

  const identitiesComponent =
    identities === null ? (
      <div>
        <Title>Identities...</Title>
      </div>
    ) : (
      <div>
        <Title>Identities</Title>{" "}
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
    ) : (
      <div>
        <Title>Vaults</Title>{" "}
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
    ) : (
      <div>
        <Title>Item Caches</Title>{" "}
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
    ) : (
      <div>
        <Title>Average</Title>
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

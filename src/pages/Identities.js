import { useState } from "react";
import { useMoralisQuery } from "react-moralis";
import styled from "styled-components";

const Container = styled.div`
  text-align: left;
  margin: 20px;
`;

const Label = styled.label`
  display: block;
  margin: 10px;
`;

export default function Identities() {
  const [elite, setElite] = useState(false);
  const [unopenedVault, setUnopenedVault] = useState(false);
  const { data, error, isLoading } = useMoralisQuery(
    "Identity",
    (query) => {
      query.notEqualTo("price", null).ascending("price").limit(100);
      if (elite) {
        query.lessThanOrEqualTo("rarity", 500);
      }
      if (unopenedVault) {
        query.equalTo("openedVault", false);
      }
      return query;
    },
    [elite, unopenedVault]
  );

  function changeElite() {
    setElite(!elite);
  }

  function changeUnopenedVault() {
    setUnopenedVault(!unopenedVault);
  }

  return (
    <Container>
      <Label>
        <input type="checkbox" checked={elite} onChange={changeElite} />
        Elite
      </Label>
      <Label>
        <input
          type="checkbox"
          checked={unopenedVault}
          onChange={changeUnopenedVault}
        />
        Unopened Vault
      </Label>
      <IdentitiesWith data={data} error={error} isLoading={isLoading} />
    </Container>
  );
}

function IdentitiesWith(props) {
  const data = props.data;
  const isLoading = props.isLoading;
  const error = props.error;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <table id="identities">
        <tbody>
          <tr>
            <th>ID</th>
            <th>Price</th>
            <th>Rarity</th>
            <th>Class</th>
            <th>Gender</th>
            <th>Race</th>
            <th>Ability</th>
            <th>Eyes</th>
            <th>Credits</th>
            <th>Credit Yield</th>
            <th>Opened Vault</th>
          </tr>
          {data.map((identity) => (
            <tr>
              <td>{identity.get("identityId")}</td>
              <td>
                <a
                  href={
                    "https://opensea.io/assets/0x86357a19e5537a8fba9a004e555713bc943a66c0/" +
                    identity.get("identityId")
                  }
                >
                  {identity.get("price")}
                </a>
              </td>
              <td>
                <a
                  href={
                    "https://raritymon.com/Item-details?collection=neotokyo&id=" +
                    identity.get("identityId")
                  }
                >
                  {identity.get("rarity")}
                </a>
              </td>
              <td>{identity.get("class")}</td>
              <td>{identity.get("gender")}</td>
              <td>{identity.get("race")}</td>
              <td>{identity.get("ability")}</td>
              <td>{identity.get("eyes")}</td>
              <td>{identity.get("credits")}</td>
              <td>{identity.get("creditYield")}</td>
              <td>{identity.get("openedVault") ? "True" : "False"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

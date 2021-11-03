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

export default function ItemCaches() {
  const [elite, setElite] = useState(false);
  const { data, error, isLoading } = useMoralisQuery(
    "ItemCache",
    (query) => {
      if (elite) {
        query.lessThanOrEqualTo("rarity", 500);
      }
      return query;
    },
    [elite]
  );

  function changeElite() {
    setElite(!elite);
  }

  return (
    <Container>
      <Label>
        <input type="checkbox" checked={elite} onChange={changeElite} />
        Elite
      </Label>
      <ItemCachesWith data={data} error={error} isLoading={isLoading} />
    </Container>
  );
}

function ItemCachesWith(props) {
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
            <th>Weapon</th>
            <th>Apparel</th>
            <th>Vehicle</th>
            <th>Helm</th>
          </tr>
          {data.map((identity) => (
            <tr>
              <td>{identity.get("itemCacheId")}</td>
              <td>
                <a
                  href={
                    "https://opensea.io/assets/0x86357a19e5537a8fba9a004e555713bc943a66c0/" +
                    identity.get("itemCacheId")
                  }
                >
                  {identity.get("price")}
                </a>
              </td>
              <td>
                <a
                  href={
                    "https://raritymon.com/Item-details?collection=neotokyo&id=" +
                    identity.get("itemCacheId")
                  }
                >
                  {identity.get("rarity")}
                </a>
              </td>
              <td>{identity.get("weapon")}</td>
              <td>{identity.get("apparel")}</td>
              <td>{identity.get("vehicle")}</td>
              <td>{identity.get("helm")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

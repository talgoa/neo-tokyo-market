import { useState } from "react";
import ReactDropdown from "react-dropdown";
import { useMoralisQuery } from "react-moralis";
import styled from "styled-components";
import PageHeader from "../components/PageHeader";

const Container = styled.div`
  text-align: left;
  margin: 20px;
`;

const Label = styled.label`
  display: block;
  margin: 10px;
`;

export default function Vaults() {
  const [elite, setElite] = useState(false);
  const [unopened, setUnopened] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [buyNow, setBuyNow] = useState(false);
  const sortByOptions = ["None", "Price", "Rarity"];
  const [sortByOption, setSortByOption] = useState(sortByOptions[0]);
  const { data, error, isLoading } = useMoralisQuery(
    "Vault",
    (query) => {
      if (sortByOption.value === "Price") {
        query.notEqualTo("price", null).ascending("price");
      }
      if (sortByOption.value === "Rarity") {
        query.notEqualTo("rarity", null).ascending("rarity");
      }
      if (elite) {
        query.lessThanOrEqualTo("rarity", 500);
      }
      if (unopened) {
        query.equalTo("openedBy", 0);
      }
      if (hasWon) {
        query.equalTo("hasWon", true);
      }
      if (buyNow) {
        query.notEqualTo("price", null)
      }
      return query;
    },
    [elite, unopened, hasWon, buyNow, sortByOption]
  );

  function changeElite() {
    setElite(!elite);
  }

  function changeUnopened() {
    setUnopened(!unopened);
  }

  function changeHasWon() {
    setHasWon(!hasWon);
  }

  function changeBuyNow() {
    setBuyNow(!buyNow);
  }

  function changeSortBy(option) {
    setSortByOption(option);
  }

  return (
    <Container>
      <PageHeader title="VAULTS" />
      <Label>
        <input type="checkbox" checked={elite} onChange={changeElite} />
        Elite
      </Label>
      <Label>
        <input type="checkbox" checked={unopened} onChange={changeUnopened} />
        Unopened
      </Label>
      <Label>
        <input type="checkbox" checked={hasWon} onChange={changeHasWon} />
        Has Won
      </Label>
      <Label>
        <input type="checkbox" checked={buyNow} onChange={changeBuyNow} />
        Buy Now
      </Label>
      <Label>
        Sort by
        <ReactDropdown
          className="SortByDropdown"
          options={sortByOptions}
          onChange={changeSortBy}
          value={sortByOption}
          placeholder="Select an option"
        />
      </Label>
      <VaultsWith data={data} error={error} isLoading={isLoading} />
    </Container>
  );
}

function VaultsWith(props) {
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
            <th>Credits</th>
            <th>Supply Proportion</th>
            <th>Additional Item</th>
            <th>Credit Multiplier</th>
            <th>Opened By</th>
            <th>Has won</th>
          </tr>
          {data.map((identity) => (
            <tr>
              <td>{identity.get("vaultId")}</td>
              <td>
                <a
                  href={
                    "https://opensea.io/assets/0xab0b0dd7e4eab0f9e31a539074a03f1c1be80879/" +
                    identity.get("vaultId")
                  }
                >
                  {identity.get("price")}
                </a>
              </td>
              <td>
                <a
                  href={
                    "https://raritymon.com/Item-details?collection=neotokyovault&id=" +
                    identity.get("vaultId")
                  }
                >
                  {identity.get("rarity")}
                </a>
              </td>
              <td>{identity.get("credits")}</td>
              <td>{identity.get("creditSupplyProportion")}</td>
              <td>{identity.get("additionalItem")}</td>
              <td>{identity.get("creditMultiplier")}</td>
              <td>{identity.get("openedBy")}</td>
              <td>{identity.get("hasWon")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

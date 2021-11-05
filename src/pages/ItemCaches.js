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

export default function ItemCaches() {
  const [elite, setElite] = useState(false);
  const [buyNow, setBuyNow] = useState(false);
  const sortByOptions = ["None", "Price", "Rarity"];
  const [sortByOption, setSortByOption] = useState(sortByOptions[0]);
  const { data, error, isLoading } = useMoralisQuery(
    "ItemCache",
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
      if (buyNow) {
        query.notEqualTo("price", null)
      }
      return query;
    },
    [elite, buyNow, sortByOption]
  );

  function changeElite() {
    setElite(!elite);
  }

  function changeBuyNow() {
    setBuyNow(!buyNow);
  }

  function changeSortBy(option) {
    setSortByOption(option);
  }

  return (
    <Container>
      <PageHeader title="ITEM CACHES"/>
      <Label>
        <input type="checkbox" checked={elite} onChange={changeElite} />
        Elite
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
                    "https://opensea.io/assets/0x0938e3f7ac6d7f674fed551c93f363109bda3af9/" +
                    identity.get("itemCacheId")
                  }
                >
                  {identity.get("price")}
                </a>
              </td>
              <td>
                <a
                  href={
                    "https://raritymon.com/Item-details?collection=neotokyoitems&id=" +
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

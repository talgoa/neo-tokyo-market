import { useState } from "react";
import ReactDropdown from "react-dropdown";
import { useMoralisQuery } from "react-moralis";
import { Route, Switch, useParams, useRouteMatch } from "react-router";
import styled from "styled-components";
import PageHeader from "../components/PageHeader";
import PageNavigation from "../components/PageNavigation";

const Container = styled.div`
  text-align: left;
  margin: 20px;
`;

const Label = styled.label`
  display: block;
  margin: 10px;
`;

export default function ItemCaches() {
  let match = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${match.path}/:page`}>
          <ItemCachesWithPage match={match} />
        </Route>
        <Route path={match.path}>
          <ItemCachesWithPage match={match} />
        </Route>
      </Switch>
    </div>
  );
}

function ItemCachesWithPage(props) {
  const match = props.match;
  const { page = "1" } = useParams();
  const itemsPerPage = 50;
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
        query.notEqualTo("price", null);
      }
      query.limit(itemsPerPage);
      query.skip((parseInt(page) - 1) * itemsPerPage);
      query.withCount();
      return query;
    },
    [page, elite, buyNow, sortByOption]
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
      <PageHeader title={"ITEM CACHES (" + data.count + ")"} />
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
      <PageNavigation
        page={page}
        match={match}
        data={data}
        itemsPerPage={itemsPerPage}
      />
      <ItemCachesWith data={data.results} error={error} isLoading={isLoading} />
      <PageNavigation
        page={page}
        match={match}
        data={data}
        itemsPerPage={itemsPerPage}
      />
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

  if (data === undefined) {
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

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

export default function Identities() {
  let match = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${match.path}/:page`}>
          <IdentitiesWithPage match={match} />
        </Route>
        <Route path={match.path}>
          <IdentitiesWithPage match={match} />
        </Route>
      </Switch>
    </div>
  );
}

function IdentitiesWithPage(props) {
  const match = props.match;
  const { page = "1" } = useParams();
  const itemsPerPage = 50;
  const [elite, setElite] = useState(false);
  const [unopenedVault, setUnopenedVault] = useState(false);
  const [buyNow, setBuyNow] = useState(false);
  const sortByOptions = ["None", "Price", "Rarity"];
  const [sortByOption, setSortByOption] = useState(sortByOptions[0]);
  const { data, error, isLoading } = useMoralisQuery(
    "Identity",
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
      if (unopenedVault) {
        query.equalTo("openedBox", 0);
      }
      if (buyNow) {
        query.notEqualTo("price", null);
      }
      query.limit(itemsPerPage);
      query.skip((parseInt(page) - 1) * itemsPerPage);
      query.withCount();
      return query;
    },
    [page, elite, unopenedVault, buyNow, sortByOption]
  );

  function changeElite() {
    setElite(!elite);
  }

  function changeUnopenedVault() {
    setUnopenedVault(!unopenedVault);
  }

  function changeBuyNow() {
    setBuyNow(!buyNow);
  }

  function changeSortBy(option) {
    setSortByOption(option);
  }

  return (
    <Container>
      <PageHeader title={"IDENTITIES (" + data.count + ")"} />
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
      <IdentitiesWith data={data.results} error={error} isLoading={isLoading} />
      <PageNavigation
        page={page}
        match={match}
        data={data}
        itemsPerPage={itemsPerPage}
      />
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
              <td>{identity.get("openedBox")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

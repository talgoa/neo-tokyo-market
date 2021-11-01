import { useState } from "react";
import { useMoralisQuery } from "react-moralis";

export default function Identities() {
  const [elite, setElite] = useState(false);
  const [unopenedVault, setUnopenedVault] = useState(false);
  const { data, error, isLoading } = useMoralisQuery(
    "Identity",
    (query) => {
      console.log("starting query");
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
    <div>
      <label>
        <input type="checkbox" checked={elite} onChange={changeElite} />
        Elite
      </label>
      <label>
        <input
          type="checkbox"
          checked={unopenedVault}
          onChange={changeUnopenedVault}
        />
        Unopened Vault
      </label>
      <IdentitiesWith data={data} error={error} isLoading={isLoading} />
    </div>
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
            <th>Strength</th>
            <th>Intelligence</th>
            <th>Attractiveness</th>
            <th>Tech Skill</th>
            <th>Cool</th>
            <th>Credits</th>
            <th>Credit Yield</th>
            <th>Opened Vault</th>
          </tr>
          {data.map((identity) => (
            <tr>
              <td>{identity.get("identityId")}</td>
              <td>{identity.get("price")}</td>
              <td>{identity.get("rarity")}</td>
              <td>{identity.get("class")}</td>
              <td>{identity.get("gender")}</td>
              <td>{identity.get("race")}</td>
              <td>{identity.get("ability")}</td>
              <td>{identity.get("eyes")}</td>
              <td>{identity.get("strength")}</td>
              <td>{identity.get("intelligence")}</td>
              <td>{identity.get("attractiveness")}</td>
              <td>{identity.get("techSkill")}</td>
              <td>{identity.get("cool")}</td>
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

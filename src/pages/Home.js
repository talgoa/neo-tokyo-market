import { Link } from "react-router-dom";
import styled from "styled-components";

const LinkTo = styled.span`
  margin: 10px;
`;

const LinkToDisabled = styled.span`
  margin: 20px;
  color: #b3b3b3;
`;

const LinkContainer = styled.div`
  margin-top: 50px;
`;

export default function Home() {
  return (
    <div>
      <h1>NEO TOKYO MARKET</h1>
      <h2>Read before using.</h2>
      <pre>
        This website is in it's early stage of development. I've just gathered
        data from different sources and put them together.
      </pre>
      <pre>
        The data is updated sporadically. I need some work to automate
        everything.
      </pre>
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
        <LinkToDisabled>
          <span>Vaults -&gt;</span>
        </LinkToDisabled>
        <LinkToDisabled>
          <span>Item Caches -&gt;</span>
        </LinkToDisabled>
      </LinkContainer>
    </div>
  );
}

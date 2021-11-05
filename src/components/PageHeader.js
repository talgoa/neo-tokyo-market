import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
`;

export default function PageHeader(props) {
  const title = props.title;

  return (
    <Container>
      <h1>{title}</h1>
      <Link to="/">Homepage -&gt;</Link>
    </Container>
  );
}

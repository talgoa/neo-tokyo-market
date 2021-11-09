import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  margin: 10px;
`;

export default function PageNavigation(props) {
  const page = props.page;
  const match = props.match;
  const data = props.data;
  const itemsPerPage = props.itemsPerPage;
  return (
    <Container>
      {page === "1" ? (
        <span>Previous</span>
      ) : (
        <Link to={`${match.url}/${parseInt(page) - 1}`}>Previous</Link>
      )}{" "}
      {page} / {Math.ceil(data.count / itemsPerPage)}{" "}
      {parseInt(page) === Math.ceil(data.count / itemsPerPage) ? (
        <span>Next</span>
      ) : (
        <Link to={`${match.url}/${parseInt(page) + 1}`}>Next</Link>
      )}
    </Container>
  );
}

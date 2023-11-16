import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <p>
        This page does not exist <Link to="/"> go there</Link>
      </p>
    </div>
  );
}

export default NotFound;

import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";

const Back = () => {
  return (
    <Link to="/">
      <IconButton>
        <ArrowBackIosIcon />
      </IconButton>
    </Link>
  );
};
export default Back;

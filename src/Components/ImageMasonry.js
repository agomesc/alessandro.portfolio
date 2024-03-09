import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Masonry from "@mui/lab/Masonry";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";

const Label = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

const ImageMasonry = ({ data }) => {
  return (
    <Box sx={{ pt: 4 }}>
      <Typography sx={{ mt: 3, mb: 3 }} variant="h4">
        Minhas Galerias
      </Typography>
      <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
        {data.map((item, index) => (
          <NavLink key={index} to={`/Photos/${item.id}`}>
            <Label>{item.title}</Label>
            <img
              srcSet={`${item.img}?w=162&auto=format&dpr=2 2x`}
              src={`${item.img}?w=162&auto=format`}
              alt={item.title}
              loading="lazy"
              style={{
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                display: "block",
                width: "100%",
                height: "auto",
                cursor: "pointer",
              }}
            />
            <Label>{item.description}</Label>
          </NavLink>
        ))}
      </Masonry>
    </Box>
  );
};

export default ImageMasonry;

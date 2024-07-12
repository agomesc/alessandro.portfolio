import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Masonry from "@mui/lab/Masonry";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import ImageComponent from "./ImageComponent";

const LabelTop = styled(Paper)(() => ({
  position: "absolute",
  content: '""',
  fontsize: 10,
  top: 0,
  left: 0,
  width: "100%",
  height: "auto",
  backgroundColor: "rgba(2, 2, 2, 0.75)",
  color: "#fff",
  textAlign: "justify",
  padding: "20px",
  display: "flex",
  alignItems: "center", // Alinhamento vertical
  borderRadius: 0, // Removi o arredondamento das bordas
  zIndex: 2,
}));

const GalleryContainer = styled(Paper)(() => ({
  position: "relative",
}));

const ImageMasonry = ({ data }) => {
  return (
    <Box sx={{ p: 0, width: "80%", alignContent: "center", alignItems: "center", margin: "0 auto" }}>
      <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
        Minhas Galerias
      </Typography>
      <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
        {data.map((item, index) => (
          <GalleryContainer>
            <NavLink key={index} to={`/Photos/${item.id}`}>
              <LabelTop>{item.title}</LabelTop>
              <ImageComponent src={item.img} alt={item.title} ></ImageComponent>
            </NavLink>
          </GalleryContainer>
        ))}
      </Masonry>
    </Box>
  );
};

export default ImageMasonry;

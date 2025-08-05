import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import type { Item } from "../types/items";
import { useAppSelector } from "../hooks/appHooks";
import { useNavigate } from "react-router";

type ItemCardProps = Item & {
  onDelete?: (id: number) => void;
  onClaim?: (id: number) => void;
};

export default function ItemCard(props: ItemCardProps) {
  const { images } = props;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const formatItemCardButton = () => {
    if (props.status === "UNCLAIMED" && props.filledByUserId !== user!.id) {
      return (
        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          onClick={() => props.onClaim?.(props.id)}
        >
          Claim
        </Button>
      );
    } else if (
      props.status === "UNCLAIMED" &&
      props.filledByUserId === user!.id
    ) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate(`/my-reports/${props.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => props.onDelete?.(props.id)}
          >
            Delete
          </Button>
        </Box>
      );
    }
    return null;
  };

  const currentImageUrl =
    images.length > 0 ? images[currentImageIndex].imageUrl : undefined;

  return (
    <Card>
      <Box position="relative">
        {currentImageUrl ? (
          <CardMedia
            sx={{
              height: {
                xs: 180,
                sm: 240,
                md: 320,
                lg: 360,
                xl: 360,
              },
            }}
            component="img"
            image={currentImageUrl}
            alt={`Image ${currentImageIndex + 1} of ${images.length}`}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              bgcolor: "#eee",
              color: "#666",
              height: {
                xs: 180,
                sm: 240,
                md: 320,
                lg: 360,
                xl: 360,
              },
            }}
          >
            No Image
          </Box>
        )}

        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              size="small"
              sx={{
                position: "absolute",
                top: "50%",
                left: 0,
                transform: "translateY(-50%)",
                bgcolor: "rgba(0,0,0,0.3)",
                color: "white",
                "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
              }}
              aria-label="Previous Image"
            >
              <ArrowBackIos fontSize="small" />
            </IconButton>

            <IconButton
              onClick={handleNext}
              size="small"
              sx={{
                position: "absolute",
                top: "50%",
                right: 0,
                transform: "translateY(-50%)",
                bgcolor: "rgba(0,0,0,0.3)",
                color: "white",
                "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
              }}
              aria-label="Next Image"
            >
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pt: 2,
          px: 2,
          pb: 0,
        }}
      >
        <Typography variant="h6">{props.name}</Typography>
        <Typography
          variant="body2"
          mt={1}
        >
          Location: {props.location}
        </Typography>
        <Typography variant="body2">
          <Typography
            variant="body2"
            component="span"
          >
            {props.status === "UNCLAIMED"
              ? `Date Found: ${new Date(
                  props.dateReported
                ).toLocaleDateString()}`
              : `Date Claimed: ${new Date(
                  props.dateClaimed!
                ).toLocaleDateString()}`}
          </Typography>
        </Typography>
        {formatItemCardButton()}
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from "react";
import Layout from "./Layout";
import ItemCard from "../../components/ItemCard";
import api from "../../lib/api";
import type { Item } from "../../types/items";
import {
  CircularProgress,
  Alert,
  Grid,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router";

export default function Reports() {
  const navigate = useNavigate();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    api
      .get("/items/my", { withCredentials: true })
      .then((res) => setItems(res.data))
      .catch((err) => {
        setError("Failed to fetch items");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await api.delete(`/items/${id}`, { withCredentials: true });
      await fetchItems();
    } catch (error) {
      console.error("Failed to delete item", error);
      fetchItems();
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">My Reports</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/my-reports/new")}
        >
          Make a Report
        </Button>
      </Box>

      <Grid
        container
        spacing={2}
        sx={{
          margin: "0 auto",
          minWidth: {
            xs: "100vw",
            md: "90vw",
          },
        }}
      >
        {items.map((item) => (
          <Grid
            key={item.id}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <ItemCard
              {...item}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import type { Item } from "../types/items";
import api from "../lib/api";
import { Typography, CircularProgress, Grid, Alert, Box } from "@mui/material";

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<"name" | "description">(
    "name"
  );
  const [sort, setSort] = useState("name-asc");
  const [location, setLocation] = useState("");
  const [dateBefore, setDateBefore] = useState("");
  const [dateAfter, setDateAfter] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoading(true);
    api
      .get("/items/unclaimed", { withCredentials: true })
      .then((res) => setItems(res.data))
      .catch((err) => {
        setError("Failed to fetch items");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleSearchChange = (query: string, field: "name" | "description") => {
    setSearchField(field);
    setSearchQuery(query);
    const [sortBy, sortDir] = sort.split("-");
    setLoading(true);

    const formatDateTime = (dateStr: string) => {
      if (!dateStr) return undefined;
      const date = new Date(dateStr);
      return date.toISOString().slice(0, 19);
    };

    api
      .get("/items/search", {
        params: {
          field,
          query,
          dateBefore: formatDateTime(dateBefore),
          dateAfter: formatDateTime(dateAfter),
          location,
          sortBy: sortBy === "date" ? "dateReported" : sortBy,
          sortDir,
        },
        withCredentials: true,
      })
      .then((res) => setItems(res.data))
      .catch((err) => {
        setError("Failed to search items");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleClaim = async (id: number) => {
    try {
      await api.post(`/items/${id}/claim`, { withCredentials: true });
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to claim item", error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography
        sx={{ mt: 2, textAlign: "center" }}
        variant="h3"
        gutterBottom
      >
        Lost & Found Items
      </Typography>

      <SearchBar
        query={searchQuery}
        field={searchField}
        setQuery={setSearchQuery}
        setField={setSearchField}
        onSearchChange={handleSearchChange}
      />

      <Filters
        sort={sort}
        location={location}
        dateBefore={dateBefore}
        dateAfter={dateAfter}
        setSort={setSort}
        setLocation={setLocation}
        setDateBefore={setDateBefore}
        setDateAfter={setDateAfter}
      />

      <Grid
        container
        spacing={2}
      >
        {items.map((item) => (
          <Grid
            key={item.id}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <ItemCard
              {...item}
              onClaim={handleClaim}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

import { Box, TextField, MenuItem, Button } from "@mui/material";

type SearchBarProps = {
  query: string;
  field: "name" | "description";
  setQuery: (q: string) => void;
  setField: (f: "name" | "description") => void;
  onSearchChange: (query: string, field: "name" | "description") => void;
};

export default function SearchBar({
  query,
  field,
  setQuery,
  setField,
  onSearchChange,
}: SearchBarProps) {
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setField(e.target.value as "name" | "description");
  };

  const handleSearchClick = () => {
    onSearchChange(query, field);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchChange(query, field);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
      <Box sx={{ display: "flex", gap: 2, width: "100%", maxWidth: 1000 }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
        />
        <TextField
          select
          label="Field"
          value={field}
          onChange={handleFieldChange}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="description">Description</MenuItem>
        </TextField>
        <Button
          sx={{ minWidth: 120 }}
          variant="contained"
          onClick={handleSearchClick}
        >
          Search
        </Button>
      </Box>
    </Box>
  );
}

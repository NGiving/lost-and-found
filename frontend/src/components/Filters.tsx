import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

type FiltersProps = {
  sort: string;
  location: string;
  dateBefore: string;
  dateAfter: string;
  setSort: (sort: string) => void;
  setLocation: (location: string) => void;
  setDateBefore: (date: string) => void;
  setDateAfter: (date: string) => void;
};

export default function Filters({
  sort,
  location,
  dateBefore,
  dateAfter,
  setSort,
  setLocation,
  setDateBefore,
  setDateAfter,
}: FiltersProps) {
  const handleSortChange = (e: SelectChangeEvent) => {
    setSort(e.target.value);
  };

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      gap={2}
      sx={{ mt: 2, mb: 2, maxWidth: 800, mx: "auto" }}
    >
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Sort</InputLabel>
        <Select
          value={sort}
          label="Sort"
          onChange={handleSortChange}
        >
          <MenuItem value="name-asc">Name A-Z</MenuItem>
          <MenuItem value="name-desc">Name Z-A</MenuItem>
          <MenuItem value="date-asc">Date Found (Oldest)</MenuItem>
          <MenuItem value="date-desc">Date Found (Newest)</MenuItem>
          <MenuItem value="location-asc">Location (A–Z)</MenuItem>
          <MenuItem value="location-desc">Location (Z–A)</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <TextField
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { max: dateBefore },
        }}
        type="datetime-local"
        label="Date Found After"
        value={dateAfter}
        onChange={(e) => setDateAfter(e.target.value)}
      />

      <TextField
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { min: dateAfter },
        }}
        type="datetime-local"
        label="Date Found Before"
        value={dateBefore}
        onChange={(e) => setDateBefore(e.target.value)}
      />
    </Box>
  );
}

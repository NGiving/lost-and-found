import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import AdminLayout from "./AdminLayout";
import type { Item } from "../../types/items";
import api from "../../lib/api";

export default function AdminDashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const dateFormatter = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const fetchItems = async () => {
    setLoading(true);
    api
      .get("/items/pending", { withCredentials: true })
      .then((res) => setItems(res.data))
      .catch((err) => {
        setError("Failed to fetch items");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleReject = async (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    await api.patch(
      `/items/${id}`,
      { status: "UNCLAIMED", claimedByUserId: null },
      { withCredentials: true }
    );
  };

  const handleApprove = async (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    await api.patch(
      `/items/${id}`,
      { status: "RETURNED" },
      { withCredentials: true }
    );
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <AdminLayout>
      <Box>
        <Typography
          sx={{ mt: 2, textAlign: "center" }}
          variant="h3"
          gutterBottom
        >
          Pending Items
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Location</TableCell>
                <TableCell align="right">Date Reported</TableCell>
                <TableCell align="right">Date Claimed</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                  >
                    {item.id}
                  </TableCell>
                  <TableCell align="right">{item.name}</TableCell>
                  <TableCell align="right">{item.location}</TableCell>
                  <TableCell align="right">
                    {dateFormatter(item.dateReported)}
                  </TableCell>
                  <TableCell align="right">
                    {dateFormatter(item.dateClaimed as string)}
                  </TableCell>
                  <TableCell align="right">{item.status}</TableCell>
                  <TableCell>
                    <Tooltip title="Approve">
                      <IconButton
                        color="success"
                        onClick={() => handleApprove(item.id)}
                      >
                        <Check />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        color="error"
                        onClick={() => handleReject(item.id)}
                      >
                        <Close />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AdminLayout>
  );
}

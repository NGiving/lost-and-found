import { useState } from "react";
import { useNavigate } from "react-router";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import Layout from "./Layout";
import api from "../../lib/api";

export default function NewItem() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    dateReported: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter((file) =>
        file.type.startsWith("image/")
      );
      setImages(validFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let responseItem = null;

    try {
      responseItem = await api.post(
        "/items",
        {
          ...formData,
          dateReported: new Date(formData.dateReported)
            .toISOString()
            .slice(0, 19),
        },
        { withCredentials: true }
      );

      if (images && images.length > 0) {
        for (const img of images) {
          const formData = new FormData();
          formData.append("file", img);

          await api.post(`/items/${responseItem!.data.id}/images`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          });
        }
      }

      navigate("/my-reports");
    } catch (err) {
      setError("Failed to create new item.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Typography
        variant="h4"
        gutterBottom
      >
        Create New Item
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: { xs: "95vw", md: "600px" },
        }}
      >
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Date Found"
          name="dateReported"
          type="datetime-local"
          value={formData.dateReported}
          onChange={handleChange}
          fullWidth
          required
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}

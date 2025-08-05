import {
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Layout from "./Layout";
import api from "../../lib/api";
import type { Item, ItemImage } from "../../types/items";

export default function EditItem() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ItemImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    dateReported: "",
  });

  useEffect(() => {
    if (id) {
      fetchItem(id);
      fetchImages(id);
    }
  }, [id]);

  const fetchItem = async (itemId: string) => {
    try {
      const res = await api.get(`/items/${itemId}`, { withCredentials: true });
      setItem(res.data);
      setFormData({
        name: res.data.name,
        location: res.data.location,
        description: res.data.description || "",
        dateReported: res.data.dateReported,
      });
    } catch (err) {
      setError("Failed to fetch item.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (itemId: string) => {
    const res = await api.get(`/items/${itemId}/images`, {
      withCredentials: true,
    });
    setExistingImages(res.data);
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

  const handleDeleteImage = async (imageId: number) => {
    await api.delete(`/items/${id}/images/${imageId}`, {
      withCredentials: true,
    });
    fetchImages(id!);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.patch(
        `/items/${id}`,
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

          await api.post(`/items/${id}/images`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          });
        }
      }

      navigate("/my-reports");
    } catch (err) {
      setError("Failed to update item.");
      console.error(err);
    }
  };

  if (loading)
    return (
      <Layout>
        <CircularProgress />
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <Alert severity="error">{error}</Alert>
      </Layout>
    );
  if (!item)
    return (
      <Layout>
        <Typography>No item found</Typography>
      </Layout>
    );

  return (
    <Layout>
      <Typography
        variant="h4"
        gutterBottom
      >
        Edit Item
      </Typography>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: {
            xs: "95vw",
            lg: "600px",
          },
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
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
          slotProps={{
            inputLabel: { shrink: true },
          }}
          type="datetime-local"
          label="Date Found"
          value={formData.dateReported.slice(0, 16)}
          onChange={handleChange}
          fullWidth
          required
        />

        <Box
          display="flex"
          gap={2}
          flexWrap="wrap"
        >
          {existingImages.map((img) => (
            <Box
              key={img.id}
              position="relative"
            >
              <img
                src={img.imageUrl}
                width={100}
              />
              <Button
                onClick={() => handleDeleteImage(img.id)}
                size="small"
                sx={{ position: "absolute", top: 0, right: 0 }}
              >
                X
              </Button>
            </Box>
          ))}
        </Box>

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

        <Box
          display="flex"
          gap={2}
        >
          <Button
            type="submit"
            variant="contained"
          >
            Save
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

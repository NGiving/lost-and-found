import type { Image } from "./image";
import type { ItemStatus } from "./itemStatus";

export interface Item {
  id: number;
  name: string;
  description: string;
  location: string;
  dateReported: Date;
  status: ItemStatus;
  dateClaimed: string | null;
  filledByUserId: number;
  claimedByUserId: number | null;
  images: Image[];
}

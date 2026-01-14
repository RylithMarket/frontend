import { RYLITH_API_URL } from "@/constants";
import axios from "axios";

export const rylithApi = axios.create({
  baseURL: RYLITH_API_URL,
});

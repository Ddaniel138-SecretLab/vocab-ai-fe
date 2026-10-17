import { backendProxy } from "@/lib/server/backend-proxy";

export const config = {
  api: { bodyParser: { sizeLimit: "256kb" }, responseLimit: "4mb" },
  maxDuration: 300,
};

export default backendProxy;

import { useCallback, useEffect, useRef, useState } from "react";
import { apiRequest, errorMessage } from "@/lib/api-client";
/** No global cache: a new account cannot inherit another account's study data. */
export function useApiQuery<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(path));
  const [revision, setRevision] = useState(0);
  const request = useRef(0);
  useEffect(() => {
    const id = ++request.current;
    const controller = new AbortController();
    if (!path) return;
    // Clear old topic/page content before displaying a different query.
    Promise.resolve().then(() => {
      if (id === request.current && !controller.signal.aborted) {
        setLoading(true);
        setError("");
        setData(null);
      }
    });
    void apiRequest<T>(path, {
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(20000)]),
    })
      .then((result) => {
        if (id === request.current && !controller.signal.aborted)
          setData(result);
      })
      .catch((e) => {
        if (id === request.current && !controller.signal.aborted)
          setError(errorMessage(e));
      })
      .finally(() => {
        if (id === request.current && !controller.signal.aborted)
          setLoading(false);
      });
    return () => {
      controller.abort();
    };
  }, [path, revision]);
  const reload = useCallback(() => setRevision((n) => n + 1), []);
  return { data, setData, error, loading, reload };
}

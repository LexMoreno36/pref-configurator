"use client";

import { useState, useEffect, useRef } from "react";
import { createModelUrlFromBase64 } from "@/lib/gltf-utils";

interface WindowPreview3DProps {
  modelGuid: string | null;
  isModelCreating: boolean;
  options: Record<string, string>;
  gltfBase64: string | null;
  isLoading: boolean;
  error: string | null;
}

export function WindowPreview3D({ modelGuid, isModelCreating, options, gltfBase64, isLoading, error, }: WindowPreview3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const disposeRef = useRef<(() => void) | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  useEffect(() => {
    // Only on the browser!
    import("@preference-sl/pref-viewer").catch(console.error);
  }, []);

  // once we've got a base64, spin up the URL
  useEffect(() => {
    if (!modelGuid || isModelCreating || !gltfBase64 || isLoading || error)
      return;

    let cancelled = false;
    (async () => {
      try {
        const { url, dispose } = await createModelUrlFromBase64(gltfBase64 as string);
        if (cancelled) {
          dispose();
          return;
        }
        disposeRef.current?.();
        disposeRef.current = dispose;
        setModelUrl(url);

      } catch (err) {
        console.error("Failed to process GLTF for 3D view:", err);
      }
    })();
    return () => {
      cancelled = true;
      disposeRef.current?.();
      disposeRef.current = null;
      setModelUrl(null);
    };
  }, [modelGuid, isModelCreating, gltfBase64, isLoading, error]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full flex items-center justify-center"
    >
      {!isLoading && !error && modelUrl && (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center">
          <pref-viewer model={modelUrl!} style={{ width: "100%", height: "100%", minHeight: "400px" }} />
        </div>

      )}
    </div>
  );
}

import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { saveRefCode } from "@/lib/shub/referral";

export const Route = createFileRoute("/r/$code")({
  ssr: false,
  component: ReferralCapture,
});

function ReferralCapture() {
  const { code } = Route.useParams();
  useEffect(() => {
    if (code) saveRefCode(code);
  }, [code]);
  return <Navigate to="/" />;
}

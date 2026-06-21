import { toast } from "sonner";
import { CheckCircle2, AlertCircle, Info, Trophy } from "lucide-react";

export const shubToast = {
  success: (msg: string, description?: string) =>
    toast.success(msg, { description, icon: <CheckCircle2 className="h-4 w-4 text-neon" /> }),
  error: (msg: string, description?: string) =>
    toast.error(msg, { description, icon: <AlertCircle className="h-4 w-4 text-destructive" /> }),
  info: (msg: string, description?: string) =>
    toast(msg, { description, icon: <Info className="h-4 w-4 text-neon" /> }),
  achievement: (msg: string, description?: string) =>
    toast(msg, {
      description,
      icon: <Trophy className="h-4 w-4 text-tier-gold" />,
      className: "ring-neon",
    }),
};

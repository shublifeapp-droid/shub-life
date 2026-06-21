import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

interface CommunityPostCardProps {
  author: string;
  avatar?: string;
  time: string;
  text: string;
  image?: string;
  likes: number;
  comments: number;
}

export function CommunityPostCard({ author, avatar, time, text, image, likes, comments }: CommunityPostCardProps) {
  const [liked, setLiked] = useState(false);
  const count = likes + (liked ? 1 : 0);
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium overflow-hidden"
    >
      <div className="flex items-center gap-3 p-4">
        {avatar ? (
          <img src={avatar} alt={author} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="grid h-10 w-10 place-items-center rounded-full bg-surface-elevated text-xs font-bold uppercase">
            {author.substring(0, 2)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{author}</p>
          <p className="text-[10px] text-muted-foreground">{time}</p>
        </div>
      </div>
      {text && <p className="px-4 pb-3 text-sm">{text}</p>}
      {image && (
        <div className="aspect-square w-full overflow-hidden bg-secondary">
          <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>
      )}
      <div className="flex items-center gap-4 px-4 py-3 text-xs">
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={() => setLiked((l) => !l)}
          className={`inline-flex items-center gap-1 ${liked ? "text-destructive" : "text-muted-foreground"}`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} /> {count}
        </motion.button>
        <button className="inline-flex items-center gap-1 text-muted-foreground">
          <MessageCircle className="h-4 w-4" /> {comments}
        </button>
        <button className="ml-auto text-muted-foreground"><Share2 className="h-4 w-4" /></button>
      </div>
    </motion.article>
  );
}

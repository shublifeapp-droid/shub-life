/**
 * Community engine — feed item shaping and engagement helpers.
 */
export type PostKind = "text" | "photo" | "achievement";

export interface Post {
  id: string;
  authorId: string;
  kind: PostKind;
  content: string;
  imageUrl?: string | null;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
}

/** Lightweight ranking signal: recency + engagement. */
export function feedScore(p: Post, now: Date = new Date()): number {
  const ageHours = Math.max(1, (now.getTime() - new Date(p.createdAt).getTime()) / 3_600_000);
  const engagement = p.likes + p.comments * 2 + p.shares * 3;
  return engagement / Math.pow(ageHours, 0.8);
}

export function sortFeed(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => feedScore(b) - feedScore(a));
}

export function achievementPost(authorId: string, title: string): Omit<Post, "id" | "createdAt"> {
  return {
    authorId,
    kind: "achievement",
    content: `🏆 ${title}`,
    likes: 0,
    comments: 0,
    shares: 0,
  };
}

/**
 * SHUB RUN — pure logic for GPS activities.
 */
export type RunActivityType = "run" | "walk" | "free" | "challenge";

export interface GpsPoint {
  latitude: number;
  longitude: number;
  recorded_at: string; // ISO
}

export interface RunGoals {
  distanceKm?: number;
  timeMinutes?: number;
  calories?: number;
}

/** Haversine distance in km between two coords. */
export function haversineKm(a: GpsPoint, b: GpsPoint): number {
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

const toRad = (d: number) => (d * Math.PI) / 180;

export function totalDistanceKm(points: GpsPoint[]): number {
  let d = 0;
  for (let i = 1; i < points.length; i++) d += haversineKm(points[i - 1], points[i]);
  return d;
}

/** Pace in min/km. Returns null if distance is zero. */
export function pace(distanceKm: number, durationSeconds: number): number | null {
  if (distanceKm <= 0) return null;
  return durationSeconds / 60 / distanceKm;
}

/** Avg speed in km/h. */
export function avgSpeed(distanceKm: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  return (distanceKm / durationSeconds) * 3600;
}

/** Rough calorie estimate (MET-based) — running ≈ 9.8, walking ≈ 3.8. */
export function estimateCalories(
  type: RunActivityType,
  durationSeconds: number,
  weightKg = 70,
): number {
  const met = type === "walk" ? 3.8 : 9.8;
  const hours = durationSeconds / 3600;
  return Math.round(met * weightKg * hours);
}

export function formatPace(p: number | null): string {
  if (p == null || !isFinite(p)) return "--'--\"";
  const m = Math.floor(p);
  const s = Math.round((p - m) * 60);
  return `${m}'${String(s).padStart(2, "0")}"`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function xpForRun(distanceKm: number): number {
  return Math.round(distanceKm * 10) + 20;
}

export function scoreDeltaForRun(distanceKm: number): number {
  return Math.min(20, Math.round(distanceKm * 2));
}

/** Build SVG polyline string for a mini route preview (normalized 0..100). */
export function toSvgPolyline(points: GpsPoint[], size = 100): string {
  if (points.length < 2) return "";
  const lats = points.map((p) => p.latitude);
  const lons = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const dLat = maxLat - minLat || 1;
  const dLon = maxLon - minLon || 1;
  return points
    .map((p) => {
      const x = ((p.longitude - minLon) / dLon) * size;
      const y = size - ((p.latitude - minLat) / dLat) * size;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

import { Icon } from "../icon";
import type { AvatarSize } from "./Avatar.types";

/**
 * Gemeinsame Beispieldaten für Avatar.stories.ts und AvatarGroup.stories.ts.
 * Interne Datei: wird nicht über index.ts exportiert.
 */

// Kleine Beispielbilder (64x64) als Data-URI, damit die Stories ohne externe Assets laufen
export const PNG_SOURCE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAACz0lEQVR42tXZTWsUQRAG4LeGXGVk9t/o2aOILmxuq3ERIqwQEDEgiAQVBe9JFI1K/LhrMEHEPxTc7CBey0PPdmbne7t6pqff0x4m2WdCpbuqmy7v/AMzMQgAo+ADmBjEALD04fwxJlZPFj3GvPg9WHps8YHAJd+b/Hj594IYgdd6MAde6wkIvNarEvJYD0bgtb6ohLzS50rINz2QLiEP9cS6hPzUL0rIWz2AwGs9JTuxt3pS+4C/egLWWtJ/2buAXMaT2K4eDLqy/deu/utuAT2djY25NT3SJdSJHsDBQWhLT4ygY73Ku/ehFX2+metCr/L2QyjXZ5q57vQqbz6GQn26mROtOcYR6nUJ2V8xG2b/MJToSbcSot1KFok+aSWEe630BQR6QtKNijoFaQR6qHlA2udYKSEjfUkzt2KXZqGETPUEvRMLekx5jPWLZVTWIY8nsTF9un4m0WdKyLy/d/K3z5SQaDpRHfKquTc6E+p1CVmYrW7fmnevV/OAtclwcnPesZ6YA7tz7Z3xvEs9MejGNG5jKt8/DNtYczJ6ADScxg7PFKT6ZBn1Vq+PFn3VA1hrQ7/7+WLZf/DWcGZRTwwa3Y1t6fc+hc33gfvXZxb0AI0245bWnCZ5cG0m0YNB65uxRP/alJ7Ow6t/DPV6qHeoB/DyW2SmT4Z6t3qVF98jAz0xB33Qqzw/ilbVl90TO9CrPPsRraQvvCd2pld5ehw11+fviR3rVXZOBg31mXvi+vW+szTUp++JW9ytDPLk56CJfqmZq+9zuk0Tvbontt/nWMnjX4NaPemhvrbHhIvU6tULNOqQ3bxAnZ7AgbC/bzWPfg+q9bmjxbLZyl2q9WX3xNnJ0OULVOoL74kL5lq3qdAXNHNlU3k/9dlmrm/6TAnl9UvNXMWJSB9KqFB/XkK15zn91JNuJfqpB2r0+mix5ixtazhzon916bRaT8B/M05YV4GuNdQAAAAASUVORK5CYII=";
export const WEBP_SOURCE =
  "data:image/webp;base64,UklGRkACAABXRUJQVlA4IDQCAADQDACdASpAAEAAPm0skkYkIqGhMBgKAIANiWgMsADtxYWyb578QPxV6gvpncA5QDRJ+cB/AOsz9ADpSyvA9in097AnQt9C/9HUeS4CD1SWfeI9oMGVb3p7egfI5wN5zBWPkz+YEHaH+uivImsr9QAA/t8hAf/Z2mMgOUR/9zfgvIvaN3Ii/8IOUCITErYr6C6/pbyV5ntBOihXmPAoq/dayglUzQDcKz/2EeKLdJZlQKVAKcHviKf8/8YYwXU61lX14zEISvbropMUZpnhRCDwmcvAEf1A1yKcGhJzX/vrSoemH5Bg48XACr/QE8MZwNzaxB0IOx71Kpp4g/gRg+qOzyr3gZpg9JIYP3AWCdpu5Xt5tJaY6NURjuMHUYzOBgYQSxBvjhTo6rcQ/TnWTG1A1FyTy4fDX50BsSR4XD/9/n8LxOBzb+qs8I5MD6tJ9FqKBXEq2s3wjIu3NRuD+FALV3SFF8hHjh/stt8Bd0lwSTrHLX2OGj9awNU9l7lJURtpAsfjb13zyaXAD3M2tx1fSM/xFVMxlVduT8YK9lPgXJKSWHdISNUn4E70Qw0jJJ6OADIHMr94fsXhhiZ/JLUMu+SKd35NGVyV8x1QTZpCLthjFjAbzfbIqQVStBZP0777wJJopya3FEwgBfsrFNqmuOQcU1Q5x06fdFUxjMWYf/BlP9QK3V0jWAIcI3xMlFZuKES3anLSUSsoi8tzSJtaXQGjfi/6ryQa0eKrP/+nrDa3gAA=";

/** Nicht auflösbare Bildquelle, um den Fallback bei Ladefehler zu zeigen */
export const BROKEN_SOURCE = "/avatar-existiert-nicht.png";

/** Plus-Icon (Lucide-Pfade); Größe und Sichtbarkeit steuert der Avatar über data-size */
export const plusIcon = Icon({ name: "plus"});
export const avatarSizes: AvatarSize[] = ["sm", "default", "lg"];

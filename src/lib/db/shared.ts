// Until auth is in place, the dashboard shows the seeded demo user's data.
const DEMO_USER_EMAIL = "demo@devstash.io";
export const USER_FILTER = { user: { email: DEMO_USER_EMAIL } };

export const ITEM_TYPE_SELECT = { id: true, name: true, icon: true, color: true } as const;

export interface ItemTypeSummary {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

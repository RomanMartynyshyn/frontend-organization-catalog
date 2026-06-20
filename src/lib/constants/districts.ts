export const KRYVYI_RIH_DISTRICTS = [
  'Довгинцівський',
  'Інгулецький',
  'Металургійний',
  'Покровський',
  'Саксаганський',
  'Тернівський',
  'Центрально-Міський',
] as const;

export type KryvyiRihDistrict = (typeof KRYVYI_RIH_DISTRICTS)[number];

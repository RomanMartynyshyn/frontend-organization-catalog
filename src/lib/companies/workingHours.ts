export function formatWorkingHoursBadge(workingHours: string): string {
  const normalized = workingHours.trim();

  if (!normalized) {
    return '';
  }

  if (/24\s*\/\s*7|цілодобово/i.test(normalized)) {
    return 'Цілодобово';
  }

  const closingTimeMatch = normalized.match(/(\d{1,2}:\d{2})\s*$/);

  if (closingTimeMatch) {
    return `Відчинено до ${closingTimeMatch[1]}`;
  }

  return normalized;
}

export function formatWorkingHoursSchedule(workingHours: string): string {
  const normalized = workingHours.trim();

  if (!normalized) {
    return '';
  }

  if (/24\s*\/\s*7|цілодобово/i.test(normalized)) {
    return 'Цілодобово';
  }

  return normalized;
}

/**
 * Age from calendar date of birth (DD/MM/YYYY), local timezone.
 * Updates automatically each year after the birthday.
 */
export function computeAgeFromDob(dob: string, ref: Date = new Date()): number {
  const m = dob.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return 18;
  const day = parseInt(m[1], 10);
  const month = parseInt(m[2], 10) - 1;
  const year = parseInt(m[3], 10);
  if (month < 0 || month > 11 || day < 1 || day > 31) return 18;
  const birth = new Date(year, month, day);
  if (Number.isNaN(birth.getTime())) return 18;
  let age = ref.getFullYear() - birth.getFullYear();
  const monthDiff = ref.getMonth() - birth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && ref.getDate() < birth.getDate())
  ) {
    age -= 1;
  }
  return Math.max(0, age);
}

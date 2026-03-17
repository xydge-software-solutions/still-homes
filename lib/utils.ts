export function koboToNaira(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(kobo / 100);
}


export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

export function getDateRange(checkIn: string, checkOut: string): string[] {
  const dates: string[] = [];
  const current = new Date(checkIn);
  const end = new Date(checkOut);
  while (current < end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}


export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}


export function generatePaystackReference(bookingId: string): string {
  return `SHORTLET-${bookingId}-${Date.now()}`;
}


export function calculateCommission(
  totalAmountKobo: number,
  commissionPercentage: number
): { commissionAmount: number; agentEarnings: number } {
  const commissionAmount = Math.round(
    (totalAmountKobo * commissionPercentage) / 100
  );
  const agentEarnings = totalAmountKobo - commissionAmount;
  return { commissionAmount, agentEarnings };
}
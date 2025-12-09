import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortDate(date: Date): string {
  return date.toDateString().split(' ').splice(1).join(' ')
}
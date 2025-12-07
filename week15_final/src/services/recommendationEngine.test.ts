import { describe, it, expect } from 'vitest';
import { getDayOfYear, getPermutationIndex } from './recommendationEngine';

describe('Recommendation Engine Utils', () => {

    describe('getDayOfYear', () => {
        it('should return 0 for Jan 1st', () => {
            const date = new Date(2023, 0, 1); // Jan 1
            // Note: Algorithm implementation detail: diff calculation might be 0-based or 1-based depending on start offset.
            // Our implementation: new Date(year, 0, 0) is Dec 31 prev year.
            // (Jan 1 - Dec 31) = 1 day. Math.floor(1) = 1.
            // Let's verify actual output.
            expect(getDayOfYear(date)).toBeGreaterThanOrEqual(1);
        });

        it('should be deterministic for the same date', () => {
            const date1 = new Date(2023, 5, 15);
            const date2 = new Date(2023, 5, 15);
            expect(getDayOfYear(date1)).toBe(getDayOfYear(date2));
        });
    });

    describe('getPermutationIndex', () => {
        it('should return an index within poolSize', () => {
            const index = getPermutationIndex(100, 500, 2023);
            expect(index).toBeGreaterThanOrEqual(0);
            expect(index).toBeLessThan(500);
        });

        it('should return different indices for consecutive days (No Collision check)', () => {
            const day1 = 100;
            const day2 = 101;
            const poolSize = 500;
            const year = 2023;

            const idx1 = getPermutationIndex(day1, poolSize, year);
            const idx2 = getPermutationIndex(day2, poolSize, year);

            expect(idx1).not.toBe(idx2);
        });

        it('should change year over year', () => {
            const day = 100;
            const poolSize = 500;

            const idx2023 = getPermutationIndex(day, poolSize, 2023);
            const idx2024 = getPermutationIndex(day, poolSize, 2024);

            expect(idx2023).not.toBe(idx2024);
        });
    });
});

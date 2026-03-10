/**
 * Calculates a composite Pollution Index (0–100) from sensor readings.
 * 0 = Clean water, 100 = Heavily polluted.
 * 
 * Weights: pH (35%), Turbidity (35%), Temperature (15%), TDS (15%)
 */
export interface SensorReadings {
    ph: number;
    turbidity: number;
    temperature: number;
    tds: number;
}

export function calcPollutionIndex(sensors: SensorReadings): number {
    // Normalise each sensor to 0–100 where 100 = worst
    const phScore = (Math.abs(sensors.ph - 7.0) / 7.0) * 100;       // ideal pH = 7
    const turbScore = Math.min(sensors.turbidity / 100, 1) * 100;    // 100 NTU = max
    const tempScore = Math.max(sensors.temperature - 25, 0) / 25 * 100; // 25°C ideal, 50°C worst
    const tdsScore = Math.min(sensors.tds / 500, 1) * 100;           // 500 ppm = max

    // Weighted average — pH and turbidity weighted higher
    const index = Math.round(
        phScore * 0.35 + turbScore * 0.35 + tempScore * 0.15 + tdsScore * 0.15
    );

    return Math.min(100, Math.max(0, index));
}

/**
 * Returns severity classification and color for a pollution index value
 */
export function getPollutionSeverity(index: number): { label: string; color: string; bgColor: string } {
    if (index <= 20) return { label: 'Excellent', color: '#34D399', bgColor: 'rgba(52, 211, 153, 0.15)' };
    if (index <= 40) return { label: 'Good', color: '#22D3EE', bgColor: 'rgba(34, 211, 238, 0.15)' };
    if (index <= 60) return { label: 'Moderate', color: '#FFA94D', bgColor: 'rgba(255, 169, 77, 0.15)' };
    if (index <= 80) return { label: 'Poor', color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.15)' };
    return { label: 'Critical', color: '#FF6B6B', bgColor: 'rgba(255, 107, 107, 0.15)' };
}

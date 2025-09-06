import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';

import { WeatherClient } from '@tehnools/simplicity-backend-test';

import { useWeatherForecast } from './useWeatherForcast';

// Mock the WeatherClient
vi.mock('@tehnools/simplicity-backend-test', () => ({
  WeatherClient: vi.fn().mockImplementation(() => ({
    getForecast: vi.fn(),
  })),
}));

describe('useWeatherForecast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    return () => {
      cleanup();
    };
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useWeatherForecast());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.forecast).toBeNull();
  });

  it('should fetch weather forecast successfully', async () => {
    const mockForecast = { temperature: 20, condition: 'Sunny' };
    const mockGetForecast = vi.fn().mockResolvedValue([mockForecast, null]);
    (WeatherClient as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      getForecast: mockGetForecast,
    }));

    const { result } = renderHook(() => useWeatherForecast());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.forecast).toEqual(mockForecast);
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error');
    const mockGetForecast = vi.fn().mockResolvedValue([null, mockError]);
    (WeatherClient as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      getForecast: mockGetForecast,
    }));

    const { result } = renderHook(() => useWeatherForecast());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(mockError);
    expect(result.current.forecast).toBeNull();
  });

  it('should update forecast when coordinates change', async () => {
    const mockForecast1 = { temperature: 20, condition: 'Sunny' };
    const mockForecast2 = { temperature: 15, condition: 'Cloudy' };
    const mockGetForecast = vi
      .fn()
      .mockResolvedValueOnce([mockForecast1, null])
      .mockResolvedValueOnce([mockForecast2, null]);

    (WeatherClient as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      getForecast: mockGetForecast,
    }));

    const { result } = renderHook(() => useWeatherForecast());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.forecast).toEqual(mockForecast1);

    act(() => {
      result.current.setCoordinates({ latitude: -41.2865, longitude: 174.7762 });
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.forecast).toEqual(mockForecast2);
    expect(mockGetForecast).toHaveBeenCalledTimes(2);
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useWeatherForecast());
    unmount();
  });
});

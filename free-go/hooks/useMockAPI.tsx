import { useEffect, useState } from 'react';
import { getMockData } from '@/mockapi/mockData';
import { MockData } from '@/mockapi/types';

export const useMockAPI = () => {
  const [data, setData] = useState<MockData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockData = await getMockData();
        setData(mockData);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

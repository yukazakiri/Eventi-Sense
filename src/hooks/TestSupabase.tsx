import React, { useEffect, useState } from 'react';
import supabase from '../api/supabaseClient'; // Adjust the path as needed

const TestSupabase: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Example query to fetch data from your Supabase database
        const { data, error } = await supabase.from('profiles').select('*');

        if (error) {
          setError(error.message);
        } else {
          setData(data);
        }
      } catch (err) {
        setError('Something went wrong: ' + err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Supabase Test</h1>
      {error && <p>Error: {error}</p>}
      {data.length > 0 ? (
        <ul>
          {data.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      ) : (
        <p>No data found</p>
      )}
    </div>
  );
};

export default TestSupabase;

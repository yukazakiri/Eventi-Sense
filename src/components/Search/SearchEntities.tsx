import { useState } from 'react';
import  supabase from '../../api/supabaseClient';

interface SearchEntitiesProps {
  eventId: string;
  onTag: (entityId: string, entityType: 'venue' | 'supplier') => void;
}

const SearchEntities = ({ onTag }: SearchEntitiesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const searchVenues = async () => {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .ilike('name', `%${searchTerm}%`);

    if (error) {
      console.error('Error searching venues:', error);
      return;
    }

    setResults(data || []);
  };

  const searchSuppliers = async () => {
    const { data, error } = await supabase
      .from('supplier')
      .select('*')
      .ilike('name', `%${searchTerm}%`);

    if (error) {
      console.error('Error searching suppliers:', error);
      return;
    }

    setResults(data || []);
  };

  const handleSearch = async (entityType: 'venue' | 'supplier') => {
    if (entityType === 'venue') {
      await searchVenues();
    } else {
      await searchSuppliers();
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search venues or suppliers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => handleSearch('venue')}>Search Venues</button>
      <button onClick={() => handleSearch('supplier')}>Search Suppliers</button>

      <ul>
        {results.map((entity) => (
          <li key={entity.id}>
            <span>{entity.name}</span>
            <button onClick={() => onTag(entity.id, 'venue')}>Tag Venue</button>
            <button onClick={() => onTag(entity.id, 'supplier')}>Tag Supplier</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchEntities;
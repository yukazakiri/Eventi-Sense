import { useState, useEffect } from 'react';
import supabase from '../../api/supabaseClient';

interface TagSelectorProps {
  type: 'venue' | 'supplier';
  onSelect: (id: string) => void;
  onDeselect: (id: string) => void;
  selectedIds: string[];
  isOpen: boolean;
  onClose: () => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ 
  type, 
  onSelect, 
  onDeselect, 
  selectedIds,
  isOpen,
  onClose 
}) => {
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEntities = async () => {
      const { data, error } = await supabase
        .from(type === 'venue' ? 'venues' : 'supplier')
        .select('id, name')
        .ilike('name', `%${searchQuery}%`);

      if (error) {
        console.error(`Error fetching ${type}s:`, error);
      } else {
        setEntities(data || []);
      }
      setLoading(false);
    };

    if (isOpen) {
      fetchEntities();
    }
  }, [type, searchQuery, isOpen]);

  if (!isOpen) return null;

  const filteredEntities = entities.filter(entity =>
    entity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto dark:bg-gray-950 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select {type === 'venue' ? 'Venues' : 'Suppliers'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-300">
            ×
          </button>
        </div>

        <input
          type="text"
          placeholder={`Search ${type === 'venue' ? 'venues' : 'suppliers'}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border-[1px] border-gray-300 rounded-lg mb-4 dark:bg-gray-950 dark:border-gray-700"
        />

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-2">
            {filteredEntities.map((entity) => (
              <div key={entity.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="checkbox"
                  id={entity.id}
                  checked={selectedIds.includes(entity.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSelect(entity.id);
                    } else {
                      onDeselect(entity.id);
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={entity.id} className="text-sm text-gray-700 dark:text-white flex-grow cursor-pointer">
                  {entity.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSelector; 
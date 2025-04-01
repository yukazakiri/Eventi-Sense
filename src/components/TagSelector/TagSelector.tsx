import { useState, useEffect } from 'react';
import supabase from '../../api/supabaseClient';
import { IoClose } from 'react-icons/io5';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#152131] rounded-lg p-6 w-[28rem] max-h-[80vh] overflow-y-auto font-sofia shadow-2xl"
        style={{
          background: `
          linear-gradient(#152131, #152131) padding-box,
          linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
          `,
          border: '1px solid transparent',
          borderRadius: '0.75rem'
      }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white tracking-wider">
            Select {type === 'venue' ? 'Venues' : 'Suppliers'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            <IoClose size={24} className="text-white/80 hover:text-white" />
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder={`Search ${type === 'venue' ? 'venues' : 'suppliers'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-[#1e2a3a] border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all duration-200"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8 text-white/70">
            <div className="animate-pulse">Loading...</div>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent">
            {filteredEntities.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No {type === 'venue' ? 'venues' : 'suppliers'} found
              </div>
            ) : (
              filteredEntities.map((entity) => (
                <div 
                  key={entity.id} 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-200 group"
                >
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
                    className="w-5 h-5 rounded-md border-gray-600/50 text-sky-500 focus:ring-sky-500/50 focus:ring-offset-0 transition-all duration-200 cursor-pointer"
                  />
                  <label 
                    htmlFor={entity.id} 
                    className="text-base text-white/90 group-hover:text-white flex-grow cursor-pointer transition-colors duration-200"
                  >
                    {entity.name}
                  </label>
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-600/30 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {selectedIds.length} selected
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagSelector;
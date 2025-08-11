
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClientSync } from '@/hooks/useClientSync';

interface Client {
  id: string;
  nom: string;
  phone: string;
  adresse: string;
}

interface ClientSearchInputProps {
  onClientSelect: (client: Client | null) => void;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ClientSearchInput: React.FC<ClientSearchInputProps> = ({
  onClientSelect,
  value,
  onChange,
  disabled = false
}) => {
  const { searchClients } = useClientSync();
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Client[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 3) {
      const results = searchClients(value);
      setSuggestions(results);
      setIsOpen(results.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [value, searchClients]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClientSelect = (client: Client) => {
    onChange(client.nom);
    onClientSelect(client);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Si l'utilisateur efface ou modifie, réinitialiser la sélection
    if (newValue.length < 3) {
      onClientSelect(null);
    }
  };

  return (
    <div className="relative">
      <Label htmlFor="clientName">Nom du client</Label>
      <Input
        ref={inputRef}
        id="clientName"
        value={value}
        onChange={handleInputChange}
        placeholder="Saisir au moins 3 caractères pour rechercher..."
        disabled={disabled}
        autoComplete="off"
      />
      
      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((client) => (
            <button
              key={client.id}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-gray-50 focus:outline-none"
              onClick={() => handleClientSelect(client)}
            >
              <div className="font-medium text-gray-900">{client.nom}</div>
              <div className="text-sm text-gray-600">{client.phone}</div>
              <div className="text-sm text-gray-500 truncate">{client.adresse}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientSearchInput;

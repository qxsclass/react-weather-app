import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { weatherClient } from '@/clients/weather-client';

interface CitySelectorProps {
  onCityChange: (city: string) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ onCityChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (inputValue.length > 2) {
      // Trigger API call after 2 characters
      const loadSuggestions = async () => {
        const response = await weatherClient.getCitySuggestions(inputValue);
        setOptions(response.map((item) => item.name));
      };
      loadSuggestions();
    }
  }, [inputValue]);

  return (
    <Autocomplete
      value={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue ?? '');
      }}
      onChange={(_, newValue) => {
        onCityChange(newValue ?? '');
      }}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select a city"
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
};

export default CitySelector;

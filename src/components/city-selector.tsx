import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface CitySelectorProps {
  onCityChange: (city: string) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ onCityChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<string[]>([]);

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

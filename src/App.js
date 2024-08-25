import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [filterOptions, setFilterOptions] = useState([]);
  const [error, setError] = useState('');

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'lowercase', label: 'Highest lowercase alphabet' },
    { value: 'email', label: 'Email' },
    { value: 'user', label: 'User' },
    { value: 'roll_number', label: 'Roll Number' }
  ];

  const handleSubmit = async () => {
    setError(''); // Clear previous errors
    try {
      const parsedJson = JSON.parse(jsonInput);

      // Validate if parsedJson.data is an array
      if (!Array.isArray(parsedJson.data)) {
        throw new Error('Invalid JSON format: `data` must be an array.');
      }

      const response = await axios.post('https://qualifier-i0zq.onrender.com/bfhl', { data: parsedJson.data });

      if (!response.data.is_success) {
        throw new Error('API error: ' + (response.data.message || 'Unknown error'));
      }

      setResponseData(response.data);
    } catch (err) {
      // Distinguish between JSON parsing errors and API errors
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format.');
      } else if (err.message.startsWith('API error:')) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const filterResponse = () => {
    if (!responseData) return null;

    let filteredData = {};

    if (filterOptions.some(option => option.value === 'user')) {
      filteredData.user = responseData.user_id;
    }

    if (filterOptions.some(option => option.value === 'email')) {
      filteredData.email = responseData.email;
    }

    if (filterOptions.some(option => option.value === 'roll_number')) {
      filteredData.roll_number = responseData.roll_number;
    }

    if (filterOptions.some(option => option.value === 'numbers')) {
      filteredData.numbers = responseData.numbers;
    }

    if (filterOptions.some(option => option.value === 'alphabets')) {
      filteredData.alphabets = responseData.alphabets;
    }

    if (filterOptions.some(option => option.value === 'lowercase')) {
      filteredData.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet;
    }

    return (
      <div>
        {filteredData.user && <p>User: {filteredData.user}</p>}
        {filteredData.email && <p>Email: {filteredData.email}</p>}
        {filteredData.roll_number && <p>Roll Number: {filteredData.roll_number}</p>}
        {filteredData.numbers && <p>Numbers: {JSON.stringify(filteredData.numbers)}</p>}
        {filteredData.alphabets && <p>Alphabets: {JSON.stringify(filteredData.alphabets)}</p>}
        {filteredData.highest_lowercase_alphabet && <p>Highest Lowercase Alphabet: {JSON.stringify(filteredData.highest_lowercase_alphabet)}</p>}
      </div>
    );
  };

  return (
    <div classname="b">
      
      <title>21BCE1035</title>
      <div><h1 class="font-medium">API INPUT</h1></div>
      <input
        type="text"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Enter JSON here"
      />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {responseData && (
        <Select
          isMulti
          options={options}
          onChange={(selectedOptions) => setFilterOptions(selectedOptions)}
        />
      )}
      <div>
        <h2>Filtered Response:</h2>
        {filterResponse()}
      </div>
    </div>
  );
}

export default App;

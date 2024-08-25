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
    setError('');
    try {
      const parsedJson = JSON.parse(jsonInput);

      if (!Array.isArray(parsedJson.data)) {
        throw new Error('Invalid JSON format: `data` must be an array.');
      }

      const response = await axios.post('https://qualifier-i0zq.onrender.com/bfhl', { data: parsedJson.data });

      if (!response.data.is_success) {
        throw new Error('API error: ' + (response.data.message || 'Unknown error'));
      }

      setResponseData(response.data);
    } catch (err) {
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
      <div className='mt-4'>
        {filteredData.user && <p className='text-lg font-medium'>User: <span className='font-normal'>{filteredData.user}</span></p>}
        {filteredData.email && <p className='text-lg font-medium'>Email: <span className='font-normal'>{filteredData.email}</span></p>}
        {filteredData.roll_number && <p className='text-lg font-medium'>Roll Number: <span className='font-normal'>{filteredData.roll_number}</span></p>}
        {filteredData.numbers && <p className='text-lg font-medium'>Numbers: <span className='font-normal'>{JSON.stringify(filteredData.numbers)}</span></p>}
        {filteredData.alphabets && <p className='text-lg font-medium'>Alphabets: <span className='font-normal'>{JSON.stringify(filteredData.alphabets)}</span></p>}
        {filteredData.highest_lowercase_alphabet && <p className='text-lg font-medium'>Highest Lowercase Alphabet: <span className='font-normal'>{JSON.stringify(filteredData.highest_lowercase_alphabet)}</span></p>}
      </div>
    );
  };

  return (
    <div className='p-5 max-w-lg mx-auto bg-white rounded-lg shadow-lg mt-5'>
      <h1 className='text-2xl font-bold mb-4 text-center'>API INPUT</h1>
      <textarea
        rows="2"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Enter JSON here"
        className='w-full p-2 border border-gray-300 rounded-lg mb-4'
      />
      <button
        onClick={handleSubmit}
        className='w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600'
      >
        Submit
      </button>
      {error && <p className='mt-4 text-red-500 text-center'>{error}</p>}
      {responseData && (
        <div className='mt-4'>
          <Select
            isMulti
            options={options}
            onChange={(selectedOptions) => setFilterOptions(selectedOptions)}
            className='mb-4'
          />
        </div>
      )}
      <div>
        <h2 className='text-xl font-semibold mb-2'>Filtered Response:</h2>
        {filterResponse()}
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { isEmpty } from 'lodash';
import { Cog8ToothIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Button } from '@/components/Button'
import AlertError from '@/components/AlertError';
import AlertSuccess from '@/components/AlertSuccess';
import AlertWarning from '@/components/AlertWarning';

const BASE_URL = 'https://jij1fqp80j.execute-api.us-east-1.amazonaws.com/';
const INIT_STATE = {
  processing: false,
  error: null,
  data: null,
};

function Search(props) {
  const [walletAddress, setWalletAddress] = useState('');
  const [formState, setFormState] = useState(JSON.parse(JSON.stringify(INIT_STATE)));

  const _handleOnChange = (e) => {
    setWalletAddress(e.target.value);
  };

  const _handleOnClick = async () => {
    console.log(walletAddress);
    if (isEmpty(walletAddress)) {
      setFormState({
        processing: false,
        error: 'Wallet address is required',
        data: null,
      });
      return;
    }
    setFormState({
      processing: true,
      error: null,
      data: null,
    });

    // Make API call to scan address
    try {
      const { data } = await axios.get(`${BASE_URL}address/${walletAddress}`)
      console.log('data', data);

      setFormState({
        processing: false,
        error: null,
        data: data.identifications || [],
      });
    } catch (error) {
      setFormState({
        processing: false,
        error: error.message,
        data: null,
      });
    }
  };

  return (
    <>
      <div>
        <label htmlFor="wallet_address" className="block text-sm font-medium leading-6 text-gray-900">
          Wallet Address
        </label>
        <div className="relative mt-2 mb-4 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="wallet_address"
            id="wallet_address"
            onChange={_handleOnChange}
            className="block w-full rounded-md py-1.5 pl-10 bg-slate-600 text-white placeholder:text-white sm:text-sm sm:leading-6"
          />
        </div>
        <Button onClick={_handleOnClick}>Scan</Button>
      </div>

      <div className='mt-6'>
        {formState.processing && <Cog8ToothIcon className="h-5 w-5 text-gray-400 animate-spin" aria-hidden="true" />}
        {formState.error && <AlertError title="Failed to retrieve results" message={formState.error} />}
        {(formState.data) && ((formState.data && formState.data.length > 0) ?
          <div>

            <pre>
              {JSON.stringify(formState.data, null, 2)}
            </pre>

            <div className="mt-4">
              <AlertWarning message="Incidents have been reported at this wallet address. Proceed with caution!" />
            </div>

          </div>
          : <AlertSuccess message="No filings or incidents have been reported at this wallet address" />)}
      </div>

    </>
  )
}

export default Search;
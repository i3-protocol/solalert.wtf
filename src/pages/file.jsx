import React, { useEffect, useRef, useState } from "react";
import { Cluster, clusterApiUrl, Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { encodeURL, createQR, findReference } from '@solana/pay';
import BigNumber from 'bignumber.js';
import axios from 'axios';
import { QRCode } from 'react-qrcode-logo';
import classNames from "classnames";

const BASE_URL = 'https://jij1fqp80j.execute-api.us-east-1.amazonaws.com/';
const DEPOSIT_ADDRESS = '5qrYHLxoYSKoPL2G2sSrwNC76kT3L8rcHGFhNNEJopdU';
const INIT_STATE = {
  wallet_address: '',
  network: 'SOL',
  category: '',
  description: '',
  name: '',
  url: '',
};
const INIT_STATE_FORM_STATUS = { error: null, success: null, processing: false };

const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/8nGGt1p0-lSA-X970Y5DZN9mCzVndMZd', 'confirmed');
const reference = new Keypair().publicKey;

function File(props) {
  const [formState, setFormState] = useState(JSON.parse(JSON.stringify(INIT_STATE)));
  const [formStatus, setFormStatus] = useState(JSON.parse(JSON.stringify(INIT_STATE_FORM_STATUS)));
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  const qrRef = useRef(null);
  const recipient = new PublicKey(DEPOSIT_ADDRESS);
  const label = 'SOLalert.wtf Incident Filing';
  const message = `Filing incident for ${formState['wallet_address']}`;
  const memo = `FILE${Date.now()}`;
  const amount = new BigNumber(0.01);

  const url = encodeURL({ recipient, amount, reference, label, message, memo });
  console.log('url', url, reference.toString());

  const pollFindReference = async (reference) => {
    console.log('pollFindReference', reference.toString())
    await findReference(connection, reference, { finality: 'confirmed' })
      .then((result) => {
        console.log('result', result);
        if (result) {
          setIsPaymentConfirmed(true);
        }
      })
      .catch((error) => {

        console.log('error', error);
      });
  };

  // Show the QR code
  useEffect(() => {
    const qr = createQR(url, 202)
    if (qrRef.current && amount.isGreaterThan(0)) {
      qrRef.current.innerHTML = ''
      qr.append(qrRef.current)
    }
  })

  // Check if payment is confirmed
  useEffect(() => {
    setInterval(() => {
      pollFindReference(reference)
    }, 5000);

  }, []);

  const _handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const _handleSubmit = async (e) => {
    e.preventDefault();
    const { wallet_address, network, category, description, name, url } = formState;
    const data = {
      wallet_address,
      network,
      category,
      description,
      name,
      url,
    };

    // Make HTTP POST request to API
    try {
      await axios.post(`${BASE_URL}address`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('data', data);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <>
      <form className="" onSubmit={_handleSubmit}>
        <div className="">
          <div className="space-y-6">
            <div>
              <h3 className="text-base text-4xl font-semibold leading-6 text-white-900">File an incident</h3>
              <p className="mt-1 max-w-2xl text-sm text-white-500">Please fill out the following form to file an incident.</p>
            </div>
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="wallet_address" className="block text-sm font-medium leading-6 text-white-900 sm:pt-1.5">
                  Wallet Address
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    name="wallet_address"
                    id="wallet_address"
                    className="block w-full max-w-lg rounded-md border-0 py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    onChange={_handleChange}
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="network" className="block text-sm font-medium leading-6 text-white-900 sm:pt-1.5">
                  Network
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <select
                    id="network"
                    name="network"
                    className="block w-full max-w-lg rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="SOL">Solana</option>
                  </select>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="category" className="block text-sm font-medium leading-6 text-white-900 sm:pt-1.5">
                  Category
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <select
                    id="category"
                    name="category"
                    className="block w-full max-w-lg rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    onChange={_handleChange}
                  >
                    <option value="sanctions">Sanctions</option>
                    <option value="hacked">Hacked</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-white-900 sm:pt-1.5">
                  Name
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="block w-full max-w-lg rounded-md border-0 py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={_handleChange}
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="url" className="block text-sm font-medium leading-6 text-white-900 sm:pt-1.5">
                  URL
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    id="url"
                    name="url"
                    type="text"
                    className="block w-full max-w-lg rounded-md border-0 py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={_handleChange}
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-white-900 sm:pt-1.5">
                  Description
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    id="description"
                    name="description"
                    type="text"
                    className="block w-full max-w-lg rounded-md border-0 py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={_handleChange}
                  />
                </div>
              </div>
            </div>
          </div>


        </div>

        <div className="py-8">
          <div>
            <h3 className="text-base text-lg font-medium leading-6 text-white-900">Submit Payment</h3>
            <p className="mt-1 max-w-2xl text-sm text-white-500">To prevent spam, we require a payment of 0.01 SOL to file an incident.</p>
            <div ref={qrRef} />
            <p className="mt-1 max-w-2xl text-sm text-white-500">Once payment has been received, proceed with filing.</p>
          </div>
          <div className="flex gap-x-3">
            <button
              type="submit"
              className={classNames("inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", { "cursor-not-allowed bg-indigo-500 disabled:opacity-75": !isPaymentConfirmed })}
              disabled={!isPaymentConfirmed}
            >
              File &rarr;
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

export default File;
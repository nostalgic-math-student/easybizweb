// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { writeContract } from 'wagmi/actions';
import { parseUnits } from 'viem';
import { abi2 } from '../contracts/generateTransactionABI';
import { getConnectorClient, getConnections } from '@wagmi/core';
import { config } from '../../config'; // Adjust the path as necessary

const MiniPayButton: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>(''); // Updated to be an empty string initially
  const [currency, setCurrency] = useState<string>('CELO'); // Default currency set to CELO
  const [comment, setComment] = useState<string>('');
  const contractAddress = '0xdb35b9738C6E58D30d59149910055A561EAA89c6';
  const { address, isConnected } = useAccount();
  
  useEffect(() => {
    if (!isConnected) {
      console.error('No wallet connected');
    } else {
      console.log('Connected address:', address);
    }
  }, [isConnected, address]);

  const handlePaymentRequest = async () => {
    try {
      if (!window.ethereum) {
        console.error('Ethereum provider not found');
        return;
      }
  
      const amountInWei = parseUnits(amount, 18);
  
      // Get the client using getConnectorClient
      const connections = getConnections(config);
      const client = await getConnectorClient(config, {
        connector: connections[0]?.connector,
      });
  
      if (!client) {
        console.error('Client not found');
        return;
      }
  
      if (!address) {
        console.error('No address found');
        return;
      }
  
      const response = await writeContract(config, {
        account: address, // Pass the client here
        address: contractAddress,
        abi: abi2,
        functionName: 'createPayment',
        args: [address, amountInWei, description, currency], // Added currency as an argument
        client,
      });
  
      console.log('Payment Request Created:', response);
      setComment('Payment Created Successfully!');
    } catch (error) {
      setComment(`${error.toString()}`);
      console.error('Payment Request Failed:', error);
    }
  };
  
  return (
    <div className="flex flex-col items-center p-4">
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter Amount"
        className="mb-2 p-2 border border-gray-300 rounded-md text-black w-full max-w-xs"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter Description"
        className="mb-2 p-2 border border-gray-300 rounded-md text-black w-full max-w-xs"
      />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded-md text-black w-full max-w-xs"
      >
        <option value="CELO">CELO</option>
        <option value="cUSD">cUSD</option>
      </select>
      <button
        onClick={handlePaymentRequest}
        className="bg-blue-500 text-black p-2 rounded-md hover:bg-blue-700 w-full max-w-xs"
      >
        Generate Payment Request
      </button>
      {comment && <p className="mt-4 text-center text-sm text-red-500">{comment}</p>}
    </div>
  );
};

export default MiniPayButton;

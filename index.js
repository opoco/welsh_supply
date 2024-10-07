const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// WelshCorgiCoin contract address on Stacks blockchain
const contractAddress = 'SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G.welshcorgicoin-token';
// Address responsible for minting the WelshCorgiCoin (mint address)
const mintAddress = 'SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G';

/**
 * Function to fetch the total supply of the WelshCorgiCoin token.
 * 
 * This function makes an HTTP GET request to the Hiro API using the provided cURL endpoint
 * to retrieve the total supply of the token, which is the maximum number of tokens ever created.
 * 
 * @returns {number} totalSupply - The total supply of WelshCorgiCoin.
 */
async function getTotalSupply() {
  try {
    // Make GET request to the Hiro API to get the token metadata, including total supply
    const totalSupplyRes = await axios.get(`https://api.hiro.so/metadata/v1/ft/${contractAddress}`);
    
    // Extract the total supply from the API response
    const totalSupply = totalSupplyRes.data.total_supply;

    // Convert the total supply to a number and return it
    return parseFloat(totalSupply); 

  } catch (error) {
    // Log any errors that occur during the API request and throw an error
    console.error('Error fetching total supply:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Function to fetch the circulating supply of the WelshCorgiCoin token.
 * 
 * This function makes an HTTP GET request to retrieve the balance data for the mint address.
 * The circulating supply is calculated based on the total number of tokens that have been unlocked
 * out from the mint address. In other words, it is the total supply minus any locked tokens
 * in the minting address.
 * 
 * @returns {number} circulatingSupply - The circulating supply of WelshCorgiCoin.
 */
async function getCirculatingSupply() {
  try {
    // Make GET request to the Hiro API to get the balance data for the mint address
    const balancesRes = await axios.get(`https://api.hiro.so/extended/v1/address/${mintAddress}/balances?until_block=60000`);

    // Extract the specific WelshCorgiCoin token balance from the fungible tokens section
    const welshToken = balancesRes.data.fungible_tokens['SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G.welshcorgicoin-token::welshcorgicoin'];
    
    // Check if the WelshCorgiCoin token is present, if not throw an error
    if (!welshToken) {
      throw new Error('WelshCorgiCoin token not found.');
    }

    // Circulating supply is the total number of tokens unlocked from the mint address (total_sent)
    const circulatingSupply = parseInt(welshToken.total_sent, 10);

    return circulatingSupply;

  } catch (error) {
    // Log any errors that occur during the API request and throw an error
    console.error('Error fetching circulating supply:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * API endpoint to get the total supply of the WelshCorgiCoin token.
 * 
 * This endpoint calls the getTotalSupply function, which returns the total number
 * of tokens created for WelshCorgiCoin.
 * 
 * @returns {JSON} Response with total supply.
 */
app.get('/total-supply', async (req, res) => {
  try {
    // Call the function to get total supply and return it as JSON
    const totalSupply = await getTotalSupply();
    res.json(totalSupply);
  } catch (error) {
    // If an error occurs, send a 500 status and error message
    res.status(500).json({ error: 'Error fetching total supply' });
  }
});

/**
 * API endpoint to get the circulating supply of the WelshCorgiCoin token.
 * 
 * This endpoint calls the getCirculatingSupply function, which calculates how many
 * tokens are currently in circulation (i.e., not held in the mint address).
 * 
 * @returns {JSON} Response with circulating supply.
 */
app.get('/circulating-supply', async (req, res) => {
  try {
    // Call the function to get circulating supply and return it as JSON
    const circulatingSupply = await getCirculatingSupply();
    res.json(circulatingSupply);
  } catch (error) {
    // If an error occurs, send a 500 status and error message
    res.status(500).json({ error: 'Error fetching circulating supply' });
  }
});

/**
 * Start the Express server and listen on the specified port.
 * 
 * The server will log a message to indicate that it is running and which port it is listening on.
 */
app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});

<div align="center">
  <img src="https://www.welshtoken.org/assets/welsh_tokenlogo-jPI8ncqE.png" alt="WelshCorgiCoin Logo" width="200">
</div>

# Welshcorgicoin Supply API

This project provides an API to retrieve information about the Welshcorgicoin token, such as the **total supply** and **circulating supply**, using the Hiro API for the Stacks blockchain.

## Features

- **Total Supply**: Retrieve the total number of Welshcorgicoin tokens created.
- **Circulating Supply**: Retrieve the total number of Welshcorgicoin tokens currently in circulation (total supply minus total tokens current locked in the mint address).

## Endpoints

1. Get Total Supply (10 billion)  
Endpoint: /total-supply  
Method: GET  
Response: 10000000000  

1. Get Circulating Supply (10 billion)  
Endpoint: /circulating-supply  
Method: GET  
Response: 10000000000  

## Additional Information [index.js]
For more details on how the information is gathered and processed, please refer to the index.js file. The file contains thorough documentation and comments explaining each step of the logic used to interact with the Hiro API and retrieve the necessary data.

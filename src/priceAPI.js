const apiKey = "91638b75-92d9-4b0f-8756-a723e3fb3688";
const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";

const getPrice = async () => {
  const response = await fetch(
    `${url}?symbol=USDC,SOL&CMC_PRO_API_KEY=${apiKey}`
  );
  const res = await response.json();

  const usdcPrice = res.data.USDC.quote.USD.price;
  const solPrice = res.data.SOL.quote.USD.price;

  console.log(`Current price of USDC: $${usdcPrice}`);
  console.log(`Current price of SOL: $${solPrice}`);
};

getPrice();

// This is a public sample test API key.
// Don't submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = Stripe("pk_test_51UW7S4D3XGqRy9QWQdt8q98IiHIg0edTZkBNC8WAgFBHZthKgfRjL6nUOb90mc0aWGP3WSE8Q46nDvwlfbE9jE5y00fDXLrJHB");

initialize();

// Create a Checkout Session
async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data.clientSecret;
  };

  const checkout = await stripe.createEmbeddedCheckoutPage({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}
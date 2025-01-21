import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const totalCost = location.state?.totalCost || 0;
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    address: "",
    zip: "",
    country: "",
  });

  const handleInputChange = (e) => {
    setBillingDetails({
      ...billingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!stripe || !elements) {
      setErrorMessage("Stripe is not properly initialized.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage("Card details are missing. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const { data: { clientSecret } } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payment`,
        { amount: totalCost * 100, currency: "usd" } 
      );

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingDetails.name,
            address: {
              line1: billingDetails.address,
              postal_code: billingDetails.zip,
              country: billingDetails.country,
            },
          },
        },
      });

      if (error) {
        setErrorMessage(`Payment failed: ${error.message}`);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setPaymentSuccess(true);
      }
    } catch (error) {
      setErrorMessage("An error occurred while processing the payment.");
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Complete Your Payment</h2>
      <p style={{ textAlign: "center", marginBottom: "20px", color: "#555" }}>
        Total Amount: <strong>${totalCost.toFixed(2)}</strong>
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={billingDetails.name}
            onChange={handleInputChange}
            placeholder="Enter you name"
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Address
          </label>
          <input
            type="text"
            name="address"
            value={billingDetails.address}
            onChange={handleInputChange}
            placeholder="123 Main St"
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <div style={{ flex: "1" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              ZIP Code
            </label>
            <input
              type="text"
              name="zip"
              value={billingDetails.zip}
              onChange={handleInputChange}
              placeholder="10001"
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ flex: "1" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Country
            </label>
            <input
              type="text"
              name="country"
              value={billingDetails.country}
              onChange={handleInputChange}
              placeholder="US"
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Card Details
          </label>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#9e2146" },
              },
            }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={!stripe || loading}
          style={{
            width: "100%",
            padding: "10px 20px",
            backgroundColor: "#6772e5",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {loading ? "Processing..." : `Pay $${totalCost.toFixed(2)}`}
        </button>
      </form>
      {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}
      {paymentSuccess && (
        <p style={{ color: "green", marginTop: "10px" }}>
          Thank you! Your payment was successful.
        </p>
      )}
    </div>
  );
};

export default Payment;

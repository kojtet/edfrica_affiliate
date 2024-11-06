// Remove the top-level import
// import PaystackPop from "@paystack/inline-js";

export const handlePayment = async (firstName, lastName, email) => {
  console.log(firstName, lastName, email);

  if (typeof window !== 'undefined') {
    try {
      const { default: PaystackPop } = await import('@paystack/inline-js');

      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: 'pk_test_e740fb8516068b2440eb760be21bfa1646899dc5',
        amount: 200 * 100,
        email,
        firstname: firstName,
        lastname: lastName,
        onSuccess(transaction) {
          alert(`Payment successful! Reference: ${transaction.reference}`);
        },
        onCancel() {
          alert('Payment was cancelled.');
        },
      });
    } catch (error) {
      console.log(error);
      alert('Something went wrong, please try again.');
    }
  } else {
    console.log('handlePayment called on the server, aborting.');
  }
};

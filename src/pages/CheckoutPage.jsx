import { useProducts } from "../context/ProductsContext";

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, products } = useProducts();

  // Utility: Clone cart and add free items based on offers
  const getCartWithOffers = () => {
    let updatedCart = [...cart];
    const offerItems = [];

    const croissant = products.find((p) => p.id === 532);
    const coffee = products.find((p) => p.id === 641);
    const cocaCola = products.find((p) => p.id === 642);

    const croissantInCart = cart.find((item) => item.id === 532);
    const cocaColaInCart = cart.find((item) => item.id === 642);

    // Offer 1: Buy 6 Coca-Cola, get 1 free
    if (cocaColaInCart && cocaCola) {
      const freeCokeCount = Math.floor(cocaColaInCart.quantity / 6);
      if (freeCokeCount > 0) {
        offerItems.push({
          id: `free-coke`,
          name: "Coca-Cola (Free)",
          price: "£0.00",
          img: cocaCola.img,
          quantity: freeCokeCount,
          isFree: true,
        });
      }
    }

    // Offer 2: Buy 3 Croissants, get 1 Coffee free
    if (croissantInCart && coffee) {
      const freeCoffeeCount = Math.floor(croissantInCart.quantity / 3);
      if (freeCoffeeCount > 0) {
        offerItems.push({
          id: `free-coffee`,
          name: "Coffee (Free)",
          price: "£0.00",
          img: coffee.img,
          quantity: freeCoffeeCount,
          isFree: true,
        });
      }
    }

    return [...updatedCart, ...offerItems];
  };

  const cartWithOffers = getCartWithOffers();

  const getDiscount = () => {
    return cartWithOffers
      .filter((item) => item.isFree)
      .reduce((sum, item) => sum + parseFloat(item.price.replace("£", "")), 0)
      .toFixed(2);
  };

  const getSubtotal = () => {
    return cart
      .reduce(
        (sum, item) =>
          sum + parseFloat(item.price.replace("£", "")) * item.quantity,
        0
      )
      .toFixed(2);
  };

  const getTotal = () => {
    return (parseFloat(getSubtotal()) - parseFloat(getDiscount())).toFixed(2);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
      <h1 className="text-xl font-bold mb-6">Checkout</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-3">
            {cartWithOffers.map((item, index) => (
              <div
                key={item.id + index}
                className={`flex flex-col sm:flex-row items-center justify-between rounded-lg shadow-sm p-3 border gap-4 ${
                  item.isFree ? "bg-green-50" : "bg-white"
                }`}
              >
                {/* Image */}
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-16 w-16 object-cover rounded"
                />

                {/* Item Info */}
                <div className="flex-1 ml-0 sm:ml-3 text-sm text-center sm:text-left">
                  <h2 className="font-medium">{item.name}</h2>
                  {item.isFree ? (
                    <span className="text-green-600 text-xs block mt-1">
                      FREE ITEM (Offer Applied)
                    </span>
                  ) : (
                    <p className="text-gray-500 text-xs mt-1">
                      Product code: {item.code || "239JU13"}
                    </p>
                  )}
                </div>

                {/* Quantity & Availability */}
                <div className="flex flex-col items-center gap-1 text-sm mt-3 sm:mt-0">
                  {!item.isFree ? (
                    <>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="bg-red-500 text-white px-2 rounded"
                        >
                          –
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="bg-green-500 text-white px-2 rounded"
                        >
                          +
                        </button>
                      </div>

                      {/* Availability */}
                      {(() => {
                        const product = products.find((p) => p.id === item.id);
                        return product?.available < 10 ? (
                          <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded mt-1">
                            Only {product.available} left
                          </div>
                        ) : null;
                      })()}
                    </>
                  ) : (
                    <span className="text-gray-500 px-2 text-sm">
                      x{item.quantity}
                    </span>
                  )}
                </div>

                {/* Price & Remove Button */}
                <div className="flex flex-col items-center sm:items-end ml-0 sm:ml-6 text-sm mt-3 sm:mt-0">
                  <span
                    className={`${
                      item.isFree ? "text-green-600" : "font-semibold"
                    }`}
                  >
                    {item.isFree ? "£0.00" : item.price}
                  </span>
                  {!item.isFree && (
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-green-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mt-2 hover:bg-red-600"
                      title="Remove item"
                    >
                      x
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="mt-10 border-t pt-4 text-sm space-y-3 max-w-md mx-auto sm:max-w-full sm:mx-0">
            <div className="flex">
              <span className="text-gray-600 font-medium w-32">Subtotal</span>
              <span className="text-right flex-1">£{getSubtotal()}</span>
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium w-32">Discount</span>
              <span className="text-right flex-1">- £{getDiscount()}</span>
            </div>
            <hr />
            <div className="flex items-center justify-between text-lg font-semibold">
              <span className="w-32">Total</span>
              <span className="text-right flex-1">£{getTotal()}</span>
            </div>

            <div className="flex justify-end mt-6">
              <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

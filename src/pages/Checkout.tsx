 import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  CreditCard,
  Check,
  Loader2,
  Trash2,
  ShoppingBag,
  AlertCircle,
  MapPin,
  User,
  Phone,
  Building,
  Home,
} from "lucide-react";
import CheckoutHeader from "../components/header/CheckoutHeader";
import Footer from "../components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/stores/usecardstore";
import { useOrderStore, formatCurrency } from "@/stores/useOrderStore";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();

  // ==================== STORES ====================
  const {
    cartId,
    cartItems,
    totalCartPrice,
    totalPriceAfterDiscount,
    couponApplied,
    numOfCartItems,
    isLoading: cartLoading,
    getCart,
    updateCartItemQuantity,
    removeCartItem,
    applyCoupon,
    removeCoupon,
    resetCart,
  } = useCartStore();

  const {
    currentOrder,
    isCreatingOrder,
    createCashOrder,
    createCheckoutSession,
  } = useOrderStore();

  const { authUser } = useAuthStore();

  // ==================== LOCAL STATE ====================
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Shipping Address - completely separate, matching backend Order model
  const [shippingAddress, setShippingAddress] = useState({
    fullname: "",
    phone: "",
    city: "",
    street: "",
    details: "",
    postalCode: "",
  });

  const [shippingOption, setShippingOption] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("cash");
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ==================== EFFECTS ====================

  // Load cart on mount
  useEffect(() => {
    getCart().catch(() => {
      // Silently handle if no cart
    });
  }, [getCart]);

  // ==================== CALCULATIONS ====================

  const getShippingCost = () => {
    switch (shippingOption) {
      case "express":
        return 50;
      case "overnight":
        return 100;
      default:
        return 0;
    }
  };

  const shipping = getShippingCost();
  const subtotal = totalPriceAfterDiscount || totalCartPrice;
  const total = subtotal + shipping;

  // ==================== HANDLERS ====================

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Required fields from backend model
    if (!shippingAddress.fullname.trim()) {
      errors.fullname = "Full name is required";
    }
    if (!shippingAddress.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    if (!shippingAddress.city.trim()) {
      errors.city = "City is required";
    }
    if (!shippingAddress.street.trim()) {
      errors.street = "Street is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleShippingChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleUpdateQuantity = async (
    itemId: string,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) {
      await removeCartItem(itemId);
    } else {
      await updateCartItemQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeCartItem(itemId);
  };

  const handleDiscountSubmit = async () => {
    if (!discountCode.trim()) {
      toast.error("Please enter a discount code");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      await applyCoupon(discountCode);
      setShowDiscountInput(false);
      setDiscountCode("");
    } catch (err) {
      // Error handled in store
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon();
    } catch (err) {
      // Error handled in store
    }
  };

  const handleCompleteOrder = async () => {
    // Check authentication
    if (!authUser) {
      toast.error("Please login first");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check cart
    if (!cartId || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Prepare shipping address for backend (matching Order model exactly)
    const orderShippingAddress = {
      fullname: shippingAddress.fullname.trim(),
      phone: shippingAddress.phone.trim(),
      city: shippingAddress.city.trim(),
      street: shippingAddress.street.trim(),
      details: shippingAddress.details.trim() || undefined,
      postalCode: shippingAddress.postalCode.trim() || undefined,
    };

    try {
      if (paymentMethod === "card") {
        // Stripe checkout
        await createCheckoutSession(cartId, orderShippingAddress);
        // Will redirect to Stripe
      } else {
        // Cash on delivery
        const result = await createCashOrder(cartId, orderShippingAddress);
        if (result) {
          setPaymentComplete(true);
          resetCart();
        }
      }
    } catch (err) {
      console.error("Order error:", err);
    }
  };

  // ==================== RENDER ====================

  // Empty cart state
  if (!cartLoading && cartItems.length === 0 && !paymentComplete) {
    return (
      <div className="min-h-screen bg-background">
        <CheckoutHeader />
        <main className="pt-20 pb-12">
          <div className="max-w-md mx-auto px-6 text-center">
            <ShoppingBag
              className="h-20 w-20 mx-auto text-muted-foreground mb-6"
              strokeWidth={1}
            />
            <h2 className="text-2xl font-light text-foreground mb-4">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Add some products to your cart to proceed with checkout.
            </p>
            <Button onClick={() => navigate("/")} className="rounded-none">
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CheckoutHeader />

      <main className="pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ==================== ORDER SUMMARY ==================== */}
            <div className="lg:col-span-1 lg:order-2">
              <div className="bg-muted/20 p-8 rounded-none sticky top-6">
                <h2 className="text-lg font-light text-foreground mb-6">
                  Order Summary ({numOfCartItems} items)
                </h2>

                {/* Loading State */}
                {cartLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="space-y-6 max-h-80 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item._id} className="flex gap-4">
                          <div className="w-20 h-20 bg-muted rounded-none overflow-hidden flex-shrink-0">
                            <img
                              src={
                                item.product?.imageCover?.secure_url ||
                                item.imageCover ||
                                "/placeholder.jpg"
                              }
                              alt={item.product?.title || item.title || "Product"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <h3 className="font-light text-foreground text-sm truncate pr-2">
                                {item.product?.title || item.title || "Product"}
                              </h3>
                              <button
                                onClick={() => handleRemoveItem(item._id)}
                                className="text-muted-foreground hover:text-red-500 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            {item.color && (
                              <div className="flex items-center gap-1 mt-1">
                                <div
                                  className="w-3 h-3 rounded-full border border-border"
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {item.color}
                                </span>
                              </div>
                            )}

                            {/* Quantity controls */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateQuantity(item._id, item.quantity, -1)
                                  }
                                  disabled={cartLoading}
                                  className="h-7 w-7 p-0 rounded-none border-muted-foreground/20"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-medium text-foreground min-w-[2ch] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateQuantity(item._id, item.quantity, 1)
                                  }
                                  disabled={cartLoading}
                                  className="h-7 w-7 p-0 rounded-none border-muted-foreground/20"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="text-foreground font-medium text-sm">
                                {formatCurrency(item.price * item.quantity)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Discount Code Section */}
                    <div className="mt-8 pt-6 border-t border-muted-foreground/20">
                      {couponApplied ? (
                        <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-700 dark:text-green-400">
                              Code "{couponApplied}" applied
                            </span>
                          </div>
                          <button
                            onClick={handleRemoveCoupon}
                            className="text-sm text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : !showDiscountInput ? (
                        <button
                          onClick={() => setShowDiscountInput(true)}
                          className="text-sm text-foreground underline hover:no-underline transition-all"
                        >
                          Have a discount code?
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Enter code"
                            className="rounded-none text-sm"
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleDiscountSubmit()
                            }
                          />
                          <Button
                            onClick={handleDiscountSubmit}
                            disabled={isApplyingCoupon}
                            className="rounded-none"
                            size="sm"
                          >
                            {isApplyingCoupon ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Apply"
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setShowDiscountInput(false);
                              setDiscountCode("");
                            }}
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Totals */}
                    <div className="mt-6 pt-6 border-t border-muted-foreground/20 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">
                          {formatCurrency(totalCartPrice)}
                        </span>
                      </div>

                      {totalPriceAfterDiscount &&
                        totalPriceAfterDiscount !== totalCartPrice && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Discount</span>
                            <span>
                              -{formatCurrency(totalCartPrice - totalPriceAfterDiscount)}
                            </span>
                          </div>
                        )}

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-foreground">
                          {shipping === 0 ? "Free" : formatCurrency(shipping)}
                        </span>
                      </div>

                      <div className="flex justify-between text-lg font-medium border-t border-muted-foreground/20 pt-3">
                        <span className="text-foreground">Total</span>
                        <span className="text-foreground">{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ==================== CHECKOUT FORM ==================== */}
            <div className="lg:col-span-2 lg:order-1 space-y-8">
              {paymentComplete ? (
                /* ==================== SUCCESS STATE ==================== */
                <div className="bg-muted/20 p-8 rounded-none text-center">
                  <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-light text-foreground mb-4">
                    Order Placed Successfully! 🎉
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    Thank you for your order. We will contact you soon to confirm.
                  </p>
                  {currentOrder?.orderNumber && (
                    <p className="text-sm text-muted-foreground mb-6">
                      Order Number:{" "}
                      <span className="font-medium text-foreground">
                        {currentOrder.orderNumber}
                      </span>
                    </p>
                  )}
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Button
                      onClick={() => navigate("/orders")}
                      variant="outline"
                      className="rounded-none"
                    >
                      View Orders
                    </Button>
                    <Button onClick={() => navigate("/")} className="rounded-none">
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* ==================== SHIPPING ADDRESS ==================== */}
                  <div className="bg-muted/20 p-8 rounded-none">
                    <h2 className="text-lg font-light text-foreground mb-6 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Address
                    </h2>

                    <div className="space-y-6">
                      {/* Full Name */}
                      <div>
                        <Label
                          htmlFor="fullname"
                          className="text-sm font-light text-foreground flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          Full Name *
                        </Label>
                        <Input
                          id="fullname"
                          value={shippingAddress.fullname}
                          onChange={(e) =>
                            handleShippingChange("fullname", e.target.value)
                          }
                          className={`mt-2 rounded-none ${
                            formErrors.fullname ? "border-red-500" : ""
                          }`}
                          placeholder="e.g. John Doe"
                        />
                        {formErrors.fullname && (
                          <p className="text-xs text-red-500 mt-1">
                            {formErrors.fullname}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-sm font-light text-foreground flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4" />
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={shippingAddress.phone}
                          onChange={(e) =>
                            handleShippingChange("phone", e.target.value)
                          }
                          className={`mt-2 rounded-none ${
                            formErrors.phone ? "border-red-500" : ""
                          }`}
                          placeholder="e.g. 01012345678"
                        />
                        {formErrors.phone && (
                          <p className="text-xs text-red-500 mt-1">
                            {formErrors.phone}
                          </p>
                        )}
                      </div>

                      {/* City */}
                      <div>
                        <Label
                          htmlFor="city"
                          className="text-sm font-light text-foreground flex items-center gap-2"
                        >
                          <Building className="h-4 w-4" />
                          City *
                        </Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) =>
                            handleShippingChange("city", e.target.value)
                          }
                          className={`mt-2 rounded-none ${
                            formErrors.city ? "border-red-500" : ""
                          }`}
                          placeholder="e.g. Cairo"
                        />
                        {formErrors.city && (
                          <p className="text-xs text-red-500 mt-1">
                            {formErrors.city}
                          </p>
                        )}
                      </div>

                      {/* Street */}
                      <div>
                        <Label
                          htmlFor="street"
                          className="text-sm font-light text-foreground flex items-center gap-2"
                        >
                          <Home className="h-4 w-4" />
                          Street *
                        </Label>
                        <Input
                          id="street"
                          value={shippingAddress.street}
                          onChange={(e) =>
                            handleShippingChange("street", e.target.value)
                          }
                          className={`mt-2 rounded-none ${
                            formErrors.street ? "border-red-500" : ""
                          }`}
                          placeholder="e.g. 123 Main Street"
                        />
                        {formErrors.street && (
                          <p className="text-xs text-red-500 mt-1">
                            {formErrors.street}
                          </p>
                        )}
                      </div>

                      {/* Details (Optional) */}
                      <div>
                        <Label
                          htmlFor="details"
                          className="text-sm font-light text-foreground"
                        >
                          Additional Details (Optional)
                        </Label>
                        <Textarea
                          id="details"
                          value={shippingAddress.details}
                          onChange={(e) =>
                            handleShippingChange("details", e.target.value)
                          }
                          className="mt-2 rounded-none min-h-[80px]"
                          placeholder="e.g. Building 5, Floor 3, Apt 12 - Near the main mosque"
                        />
                      </div>

                      {/* Postal Code (Optional) */}
                      <div>
                        <Label
                          htmlFor="postalCode"
                          className="text-sm font-light text-foreground"
                        >
                          Postal Code (Optional)
                        </Label>
                        <Input
                          id="postalCode"
                          value={shippingAddress.postalCode}
                          onChange={(e) =>
                            handleShippingChange("postalCode", e.target.value)
                          }
                          className="mt-2 rounded-none"
                          placeholder="e.g. 12345"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ==================== SHIPPING OPTIONS ==================== */}
                  <div className="bg-muted/20 p-8 rounded-none">
                    <h2 className="text-lg font-light text-foreground mb-6">
                      Shipping Options
                    </h2>

                    <RadioGroup
                      value={shippingOption}
                      onValueChange={setShippingOption}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-none cursor-pointer hover:border-foreground/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label
                            htmlFor="standard"
                            className="font-light text-foreground cursor-pointer"
                          >
                            Standard Shipping
                          </Label>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Free • 3-5 business days
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-none cursor-pointer hover:border-foreground/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="express" id="express" />
                          <Label
                            htmlFor="express"
                            className="font-light text-foreground cursor-pointer"
                          >
                            Express Shipping
                          </Label>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(50)} • 1-2 business days
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-none cursor-pointer hover:border-foreground/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="overnight" id="overnight" />
                          <Label
                            htmlFor="overnight"
                            className="font-light text-foreground cursor-pointer"
                          >
                            Overnight Delivery
                          </Label>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(100)} • Next business day
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* ==================== PAYMENT METHOD ==================== */}
                  <div className="bg-muted/20 p-8 rounded-none">
                    <h2 className="text-lg font-light text-foreground mb-6">
                      Payment Method
                    </h2>

                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(val) => setPaymentMethod(val as "card" | "cash")}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-none cursor-pointer hover:border-foreground/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label
                            htmlFor="cash"
                            className="font-light text-foreground cursor-pointer"
                          >
                            💵 Cash on Delivery
                          </Label>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Pay when you receive
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-none cursor-pointer hover:border-foreground/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="card" id="card" />
                          <Label
                            htmlFor="card"
                            className="font-light text-foreground cursor-pointer flex items-center gap-2"
                          >
                            <CreditCard className="h-5 w-5" />
                            Credit/Debit Card
                          </Label>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Secure payment via Stripe
                        </div>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "card" && (
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-none flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                          You will be redirected to Stripe's secure payment page.
                        </p>
                      </div>
                    )}

                    {/* Order Summary before submit */}
                    <div className="mt-8 bg-muted/10 p-6 rounded-none border border-muted-foreground/20 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-foreground">
                          {shipping === 0 ? "Free" : formatCurrency(shipping)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-medium border-t border-muted-foreground/20 pt-3">
                        <span className="text-foreground">Total</span>
                        <span className="text-foreground">{formatCurrency(total)}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCompleteOrder}
                      disabled={isCreatingOrder || cartItems.length === 0}
                      className="w-full rounded-none h-12 text-base mt-6"
                    >
                      {isCreatingOrder ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : paymentMethod === "card" ? (
                        `Pay Now • ${formatCurrency(total)}`
                      ) : (
                        `Place Order • ${formatCurrency(total)}`
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
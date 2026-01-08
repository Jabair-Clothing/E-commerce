import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchProduct,
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/api";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// Sub-components
import ProductGallery from "../components/ProductDetails/ProductGallery";
import ProductInfo from "../components/ProductDetails/ProductInfo";
import ProductSelectors from "../components/ProductDetails/ProductSelectors";
import ProductActions from "../components/ProductDetails/ProductActions";
import ProductDescription from "../components/ProductDetails/ProductDescription";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, setIsCartOpen } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlist, setIsWishlist] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);

  // Dynamic Selection State
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [displayPrice, setDisplayPrice] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);
  const [activeSku, setActiveSku] = useState(null);

  // Derived Data
  const [availableAttributes, setAvailableAttributes] = useState({});

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const response = await fetchProduct(id);
        if (response.success) {
          const productData = response.data;
          setProduct(productData);
          setDisplayPrice(
            productData.discount_price ||
              productData.final_price ||
              productData.price
          );
          setDisplayImage(productData.primary_image);

          // Process Attributes from SKUs
          if (productData.skus && productData.skus.length > 0) {
            const attrs = {};
            // Loop through all SKUs to collect all possible attribute values
            productData.skus.forEach((sku) => {
              sku.attributes.forEach((attr) => {
                if (!attrs[attr.attribute_name]) {
                  attrs[attr.attribute_name] = [];
                }
                // Add value if not exists
                if (
                  !attrs[attr.attribute_name].find(
                    (v) => v.id === attr.value_id
                  )
                ) {
                  attrs[attr.attribute_name].push({
                    id: attr.value_id,
                    name: attr.value_name,
                    code: attr.value_code,
                    // Storing image specifically for color interactions if needed
                    image_url: attr.image_url,
                  });
                }
              });
            });
            setAvailableAttributes(attrs);

            // Auto-select if only 1 SKU
            if (productData.skus.length === 1) {
              const singleSku = productData.skus[0];
              const autoSelection = {};
              singleSku.attributes.forEach((attr) => {
                autoSelection[attr.attribute_name] = attr.value_name;
              });
              setSelectedAttributes(autoSelection);
            }
          }

          // Check Wishlist Status
          if (user) {
            try {
              const wishlistResponse = await fetchWishlist();
              if (wishlistResponse.success) {
                // Assuming response.data is an array of wishlist items
                // Need to find if current product id matches any product_id in wishlist
                const foundItem = wishlistResponse.data.find(
                  (item) =>
                    item.product_id === parseInt(id) ||
                    item.product_id === productData.id // Ensure ID types match
                );

                if (foundItem) {
                  setIsWishlist(true);
                  setWishlistId(foundItem.wishlist_id);
                } else {
                  setIsWishlist(false);
                  setWishlistId(null);
                }
              }
            } catch (err) {
              console.error("Failed to check wishlist status", err);
            }
          }
        } else {
          setError("Failed to load product details.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while loading the product.");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, user]);

  useEffect(() => {
    console.log("Product Data:", product);
    console.log("Selected Attributes:", selectedAttributes);
    console.log("Active SKU:", activeSku);
  }, [product, selectedAttributes, activeSku]);

  // Update SKU Selection logic
  useEffect(() => {
    if (!product || !product.skus) return;

    // Try to find a matching SKU based on currently selected attributes
    // A match exists if every selected attribute key matches the sku's attribute value
    // We only update if a *complete* set of attributes is selected, OR we can try to do partials?
    // For E-commerce, usually we wait for full selection to define a SKU, but can update image on partial (e.g. Color).

    // Check if product requires attributes
    const hasAttributes = Object.keys(availableAttributes).length > 0;

    // If product has SKUs but no attributes (e.g. simple product), auto-select first SKU
    if (!hasAttributes && product.skus.length === 1) {
      const sku = product.skus[0];
      setActiveSku(sku);
      setDisplayPrice(sku.final_price || sku.discount_price || sku.price);
      if (sku.image) setDisplayImage(sku.image);
      return;
    }

    const selectedKeys = Object.keys(selectedAttributes);
    // Only attempt match if we have selections
    if (selectedKeys.length > 0) {
      // 1. Update Display Image based on Color selection immediately if available
      // Assumes 'Color' is the key name from backend api
      if (selectedAttributes["Color"]) {
        // Find the value image for this color
        const colorAttrList = availableAttributes["Color"];
        const selectedColor = colorAttrList?.find(
          (c) => c.name === selectedAttributes["Color"]
        );
        // Note: API returns user variant image inside attributes too, or we can look at the sku...
        // Let's use the first SKU that matches this color to get an image
        const matchingSkuForImage = product.skus.find((s) =>
          s.attributes.some(
            (a) =>
              a.attribute_name === "Color" &&
              a.value_name === selectedAttributes["Color"]
          )
        );

        // If that SKU has a specific image, use it.
        if (matchingSkuForImage && matchingSkuForImage.image) {
          setDisplayImage(matchingSkuForImage.image);
        } else if (selectedColor && selectedColor.image_url) {
          setDisplayImage(selectedColor.image_url);
        }
      }

      // 2. Find Exact SKU Match
      const match = product.skus.find((sku) => {
        // Check if this SKU has every selected attribute
        return selectedKeys.every((key) => {
          const detail = sku.attributes.find((a) => a.attribute_name === key);
          return detail && detail.value_name === selectedAttributes[key];
        });
      });

      // If we found a match AND the number of selected attributes equals the required attributes for a SKU
      // (Assuming all SKUs have same number of attributes? Usually yes)
      const requiredAttrCount = product.skus[0]?.attributes.length || 0;

      if (match && selectedKeys.length === requiredAttrCount) {
        setActiveSku(match);
        setDisplayPrice(
          match.final_price || match.discount_price || match.price
        );
        if (match.image) setDisplayImage(match.image);
      } else {
        setActiveSku(null);
        // Reset Price to base if selection is partial/invalid? Or keep last known?
        // Keeping base price might be confusing if variants are expensive.
        // Let's keep it simple: if full match, show specific price. Else base.
        if (selectedKeys.length !== requiredAttrCount) {
          setDisplayPrice(
            product.discount_price || product.final_price || product.price
          );
        }
      }
    }
  }, [selectedAttributes, product, availableAttributes]);

  const handleAttributeSelect = (name, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddToCart = () => {
    if (product.skus && product.skus.length > 0 && !activeSku) {
      const missingOptions = Object.keys(availableAttributes).join(", ");
      alert(
        `Please select all options (${missingOptions}) before adding to cart.`
      );
      return;
    }
    addToCart(product, activeSku, 1, selectedAttributes);
    setIsCartOpen(true);
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      alert("Please login first to manage wishlist.");
      return;
    }

    try {
      if (isWishlist) {
        // Remove from Wishlist
        if (!wishlistId) return; // Safety check
        const response = await removeFromWishlist(wishlistId);
        if (response.success) {
          setIsWishlist(false);
          setWishlistId(null);
          alert("Removed from wishlist.");
        } else {
          alert(response.message || "Failed to remove from wishlist.");
        }
      } else {
        // Add to Wishlist
        const response = await addToWishlist({
          user_id: user.id,
          product_id: product.id,
        });
        if (response.success) {
          setIsWishlist(true);
          // Assuming response contains the new wishlist item or at least the id,
          // but often basic add response might not return full object.
          // We might need to refetch or assume a placeholder if API doesn't return ID.
          // Let's check api.js: addToWishlist returns response.data.
          // If backend follows REST, it usually returns created resource.
          // For now, let's re-fetch wishlist or just toggle UI.
          // To get the NEW wishlistId, we'd ideally get it from response.
          // If response.data.data.wishlist_id exists... let's assume standard response for now.
          // Or just re-fetch to be safe and simple.
          const newWishlist = await fetchWishlist();
          if (newWishlist.success) {
            const found = newWishlist.data.find(
              (item) => item.product_id === product.id
            );
            if (found) setWishlistId(found.wishlist_id);
          }
          alert("Product added to wishlist successfully!");
        } else {
          alert(response.message || "Failed to add to wishlist.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating wishlist.");
    }
  };

  const checkAvailability = (attrName, attrValue) => {
    if (!product || !product.skus) return false;

    // Create a temporary selection including existing selections minus the current attribute category
    const relevantSelections = { ...selectedAttributes };
    delete relevantSelections[attrName];

    // Check if any SKU matches the relevant selections AND this specific attribute value AND has stock > 0
    return product.skus.some((sku) => {
      const matchRelevant = Object.entries(relevantSelections).every(
        ([key, val]) => {
          const attr = sku.attributes.find((a) => a.attribute_name === key);
          return attr && attr.value_name === val;
        }
      );

      const matchCurrent = sku.attributes.some(
        (a) => a.attribute_name === attrName && a.value_name === attrValue
      );

      return matchRelevant && matchCurrent && sku.quantity > 0;
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-lagoon-600 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error || "Product not found"}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <ProductGallery
          images={product.images}
          displayImage={displayImage}
          setDisplayImage={setDisplayImage}
          stockQuantity={product.stock_quantity}
          productName={product.name}
        />

        {/* Right: Details */}
        <div>
          <ProductInfo
            product={product}
            activeSku={activeSku}
            displayPrice={displayPrice}
          />

          <ProductSelectors
            availableAttributes={availableAttributes}
            selectedAttributes={selectedAttributes}
            onSelect={handleAttributeSelect}
            checkAvailability={checkAvailability}
          />

          <ProductActions
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            disabled={
              product.stock_quantity === 0 ||
              (activeSku && activeSku.quantity === 0)
            }
            label={
              product.stock_quantity === 0 ||
              (activeSku && activeSku.quantity === 0)
                ? "Out of Stock"
                : "Add to Cart"
            }
            isWishlist={isWishlist}
          />

          <ProductDescription description={product.description} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

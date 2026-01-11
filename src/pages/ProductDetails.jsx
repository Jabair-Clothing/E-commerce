import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct, recordProductView } from "../services/api";
import { Loader2 } from "lucide-react";

// Sub-components
import ProductGallery from "../components/ProductDetails/ProductGallery";
import ProductInfo from "../components/ProductDetails/ProductInfo";
import ProductSelectors from "../components/ProductDetails/ProductSelectors";
import ProductDescription from "../components/ProductDetails/ProductDescription";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

          // Record View
          recordProductView(productData.id);

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
  }, [id]);

  useEffect(() => {
    console.log("Product Data:", product);
    console.log("Selected Attributes:", selectedAttributes);
    console.log("Active SKU:", activeSku);
  }, [product, selectedAttributes, activeSku]);

  // Update SKU Selection logic
  useEffect(() => {
    if (!product || !product.skus) return;

    // Try to find a matching SKU based on currently selected attributes
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
      if (selectedAttributes["Color"]) {
        const colorAttrList = availableAttributes["Color"];
        const selectedColor = colorAttrList?.find(
          (c) => c.name === selectedAttributes["Color"]
        );
        const matchingSkuForImage = product.skus.find((s) =>
          s.attributes.some(
            (a) =>
              a.attribute_name === "Color" &&
              a.value_name === selectedAttributes["Color"]
          )
        );

        if (matchingSkuForImage && matchingSkuForImage.image) {
          setDisplayImage(matchingSkuForImage.image);
        } else if (selectedColor && selectedColor.image_url) {
          setDisplayImage(selectedColor.image_url);
        }
      }

      // 2. Find Exact SKU Match
      const match = product.skus.find((sku) => {
        return selectedKeys.every((key) => {
          const detail = sku.attributes.find((a) => a.attribute_name === key);
          return detail && detail.value_name === selectedAttributes[key];
        });
      });

      const requiredAttrCount = product.skus[0]?.attributes.length || 0;

      if (match && selectedKeys.length === requiredAttrCount) {
        setActiveSku(match);
        setDisplayPrice(
          match.final_price || match.discount_price || match.price
        );
        if (match.image) setDisplayImage(match.image);
      } else {
        setActiveSku(null);
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

  const checkAvailability = (attrName, attrValue) => {
    if (!product || !product.skus) return false;

    const relevantSelections = { ...selectedAttributes };
    delete relevantSelections[attrName];

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

  const handleRequestQuote = () => {
    const subject = encodeURIComponent(`Inquiry about ${product.name}`);
    const body = encodeURIComponent(
      `Hi JABAIBGROUP Team,\n\nI am interested in the product: ${
        product.name
      } (SKU: ${
        activeSku ? activeSku.sku : product.sku || "N/A"
      }).\n\nPlease provide me with a quote and minimum order quantity details.\n\nThank you.`
    );
    window.location.href = `mailto:info@jabaibgroup.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
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

          {/* Request Quote Button */}
          <button
            onClick={handleRequestQuote}
            className="w-full bg-black text-white font-bold uppercase tracking-[0.2em] py-5 mb-0 hover:bg-gray-900 transition-colors"
          >
            Request Price
          </button>

          <ProductDescription description={product.description} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

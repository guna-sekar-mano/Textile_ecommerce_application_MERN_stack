import { useEffect, useRef, useState } from 'react';
import Productsview from '../shared/components/Productview/Productsview';
import { useParams, useLocation } from 'react-router-dom';
import apiurl from '../shared/services/apiendpoint/apiendpoint';
import { getCustomerProductById } from '../shared/services/apicustomerProducts/apicustomerproducts';

export default function ProductsViewPage() {
  const [selected, setSelected] = useState(1);
  const container3Ref = useRef(null);
  const container7Ref = useRef(null);
  const container2Ref = useRef(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [currentMainImage, setCurrentMainImage] = useState(0);
  const { productType, productName } = useParams();
  const location = useLocation();

  const toggleAccordion = (id) => {
    setSelected(selected !== id ? id : null);
  };

  const getImageUrl = (imagePath) => {
    return `${apiurl()}/${imagePath}`;
  };

  const getCurrentProductData = () => {
    if (!product) return null;
    if (selectedVariant) {
      return {
        ...selectedVariant,
        Product_Name: selectedVariant.variant_name,
        Product_Description: selectedVariant.description,
        Images: selectedVariant.variant_images,
        tags: selectedVariant.tags || product.tags,
      };
    }
    return {
      ...product,
      Product_Description: product.description,
    };
  };

  const currentProduct = getCurrentProductData();

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
    setCurrentMainImage(0);
  };

  const handlePrimaryProductClick = () => {
    setSelectedVariant(null);
    setCurrentMainImage(0);
  };

  const handleThumbnailClick = (index) => {
    setCurrentMainImage(index);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        const productId = location.state?.productId || location.state?.product?._id;
        
        if (!productId) {
          throw new Error('Product ID not provided');
        }

        const data = await getCustomerProductById(productId, productType, productName);
        
        if (data && data.resdata) {
          setProduct(data.resdata);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [location.state, productType, productName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <Productsview selected={selected} container2Ref={container2Ref} container3Ref={container3Ref} container7Ref={container7Ref} currentProduct={currentProduct} 
        getImageUrl={getImageUrl} currentMainImage={currentMainImage} selectedVariant={selectedVariant} handlePrimaryProductClick={handlePrimaryProductClick} 
        product={product} handleVariantClick={handleVariantClick} handleThumbnailClick={handleThumbnailClick} toggleAccordion={toggleAccordion}
    />
  );
} 
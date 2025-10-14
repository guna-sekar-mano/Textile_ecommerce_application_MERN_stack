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
  const [selectedSize, setSelectedSize] = useState('');
  const { productType, productName, routerLink } = useParams();
  const location = useLocation();

  const toggleAccordion = (id) => {
    setSelected(selected !== id ? id : null);
  };

  const getImageUrl = (imagePath) => {
    return `${apiurl()}/${imagePath}`;
  };

  useEffect(() => {
    if (location.state?.product) {
      setProduct(location.state.product);
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (product?.variants?.[0]?.sizes?.[0]) {
      setSelectedSize(product.variants[0].sizes[0].size);
    }
  }, [product]);

const getCurrentProductData = () => {
    if (!product) return null;
    if (selectedVariant) {
        return {
            ...product,
            ...selectedVariant,
            Product_Name: selectedVariant.variant_name,
            Product_Description: selectedVariant.description,
            Images: selectedVariant.variant_images,
            tags: selectedVariant.tags || product.tags,
            _id: product._id,
            variantId: selectedVariant._id,
        };
    } else {
        const firstVariant = product.variants[0];
        const processedVariant = {
            ...product,
            ...firstVariant,
            Product_Name: firstVariant.variant_name,
            Images: firstVariant.variant_images,
            _id: product._id,
            variantId: firstVariant._id,
            originalProductId: product._id,
        };
        
        setSelectedVariant({
            ...firstVariant,
            originalProductId: product._id
        });
        return processedVariant;
    }
};

  const currentProduct = getCurrentProductData();

  const handleVariantClick = (variant, index) => {
      const selectedVariantData = {
          ...product.variants[index],
          Product_Name: product.variants[index].variant_name,
          Images: product.variants[index].variant_images,
          _id: product.variants[index]._id,
          originalProductId: product._id,
      };
      setSelectedVariant(selectedVariantData);
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
        const productRouterLink = location.state?.product?.Router_Link || routerLink;

        if (!productRouterLink) {
          throw new Error('Router Link not provided');
        }

        if (!product) {
          const data = await getCustomerProductById(productRouterLink, productType, productName);
          if (data && data.resdata) {
            setProduct(data.resdata);
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [location.state, productType, productName, routerLink, product]);

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
    <Productsview
      selected={selected}
      container2Ref={container2Ref}
      container3Ref={container3Ref}
      container7Ref={container7Ref}
      currentProduct={currentProduct}
      getImageUrl={getImageUrl}
      currentMainImage={currentMainImage}
      selectedVariant={selectedVariant}
      handlePrimaryProductClick={handlePrimaryProductClick}
      product={product}
      handleVariantClick={handleVariantClick}
      handleThumbnailClick={handleThumbnailClick}
      toggleAccordion={toggleAccordion}
      selectedSize={selectedSize}
      setSelectedSize={setSelectedSize}
    />
  );
}
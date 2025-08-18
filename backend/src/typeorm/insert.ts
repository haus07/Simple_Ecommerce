import axios from 'axios';
import { postgresDataSource } from './appDataSource';
import { Product } from '../entities/product.entity';

async function seedProducts() {
    await postgresDataSource.initialize()
  const productRepo = await postgresDataSource.getRepository(Product);

    const products: Partial<Product>[] = [
      {
    title: "MacBook Pro 16",
    brand: "Apple",
    category: "Laptop",
    description: "Powerful laptop with M1 Pro chip, Liquid Retina XDR display, and long battery life.",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca9"
    ],
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    rating: 5
  },
  {
    title: "Google Pixel 7 Pro",
    brand: "Google",
    category: "Smartphone",
    description: "Google’s flagship with Tensor G2 chip, excellent camera, and smooth software.",
    images: [
      "https://images.unsplash.com/photo-1664575600764-6a56743b20b3",
      "https://images.unsplash.com/photo-1664575600764-6a56743b20b4"
    ],
    thumbnail: "https://images.unsplash.com/photo-1664575600764-6a56743b20b3",
    rating: 4
  },
  {
    title: "Bose QuietComfort 45",
    brand: "Bose",
    category: "Headphones",
    description: "Comfortable noise cancelling headphones with clear sound and long battery life.",
    images: [
      "https://images.unsplash.com/photo-1586952518484-1a1c50f5752a",
      "https://images.unsplash.com/photo-1586952518484-1a1c50f5752b"
    ],
    thumbnail: "https://images.unsplash.com/photo-1586952518484-1a1c50f5752a",
    rating: 5
  },
  {
    title: "Adidas Ultraboost 22",
    brand: "Adidas",
    category: "Shoes",
    description: "Comfortable running shoes with responsive Boost cushioning.",
    images: [
      "https://images.unsplash.com/photo-1600185365753-7c1d012f4e5b",
      "https://images.unsplash.com/photo-1600185365753-7c1d012f4e5c"
    ],
    thumbnail: "https://images.unsplash.com/photo-1600185365753-7c1d012f4e5b",
    rating: 4
  },
  {
    title: "Lenovo ThinkPad X1 Carbon",
    brand: "Lenovo",
    category: "Laptop",
    description: "Business laptop with lightweight design, strong build, and great keyboard.",
    images: [
      "https://images.unsplash.com/photo-1589720149503-8d1e982d760e",
      "https://images.unsplash.com/photo-1589720149503-8d1e982d760f"
    ],
    thumbnail: "https://images.unsplash.com/photo-1589720149503-8d1e982d760e",
    rating: 5
  },
  {
    title: "JBL Flip 6",
    brand: "JBL",
    category: "Speaker",
    description: "Portable waterproof Bluetooth speaker with powerful sound.",
    images: [
      "https://images.unsplash.com/photo-1590608897129-d3e8ab6d5fbd",
      "https://images.unsplash.com/photo-1590608897129-d3e8ab6d5fbe"
    ],
    thumbnail: "https://images.unsplash.com/photo-1590608897129-d3e8ab6d5fbd",
    rating: 4
  },
  {
    title: "Canon EOS R6",
    brand: "Canon",
    category: "Camera",
    description: "Full-frame mirrorless camera with fast autofocus and excellent image quality.",
    images: [
      "https://images.unsplash.com/photo-1549924231-f129b911e442",
      "https://images.unsplash.com/photo-1549924231-f129b911e443"
    ],
    thumbnail: "https://images.unsplash.com/photo-1549924231-f129b911e442",
    rating: 5
  },
  {
    title: "Microsoft Surface Pro 9",
    brand: "Microsoft",
    category: "Tablet",
    description: "Versatile 2-in-1 tablet with touchscreen and detachable keyboard.",
    images: [
      "https://images.unsplash.com/photo-1612831455545-71138e6508be",
      "https://images.unsplash.com/photo-1612831455545-71138e6508bf"
    ],
    thumbnail: "https://images.unsplash.com/photo-1612831455545-71138e6508be",
    rating: 4
  },
  {
    title: "Logitech MX Master 3",
    brand: "Logitech",
    category: "Accessories",
    description: "Ergonomic wireless mouse with ultra-fast scrolling and customizable buttons.",
    images: [
      "https://images.unsplash.com/photo-1555617117-fc627aafc2aa",
      "https://images.unsplash.com/photo-1555617117-fc627aafc2ab"
    ],
    thumbnail: "https://images.unsplash.com/photo-1555617117-fc627aafc2aa",
    rating: 5
  },
  {
    title: "Fitbit Charge 5",
    brand: "Fitbit",
    category: "Wearable",
    description: "Advanced fitness tracker with built-in GPS, heart rate monitor, and sleep tracking.",
    images: [
      "https://images.unsplash.com/photo-1600185365247-3f9bb465f93f",
      "https://images.unsplash.com/photo-1600185365247-3f9bb465f940"
    ],
    thumbnail: "https://images.unsplash.com/photo-1600185365247-3f9bb465f93f",
    rating: 4
  }
    // ... thêm các sản phẩm khác tương tự
  ];

  await productRepo.save(products);
  console.log("Seeded products successfully!");
}

seedProducts().catch(console.error);
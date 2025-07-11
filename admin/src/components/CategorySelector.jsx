import React from "react";

const categories = ["Skincare", "Makeup", "Hair Care"];

const subCategories = {
  Skincare: ["Cleansers", "Moisturizers", "Serums"],
  Makeup: ["Foundation", "Lipstick"],
  "Hair Care": ["Shampoo", "Conditioner"],
};

const CategorySelector = ({ category, setCategory, subCategory, setSubcategory }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-6">
      {/* Category Dropdown */}
      <div>
        <p className="mb-2">Product Category</p>
        <select
          onChange={(e) => {
            setCategory(e.target.value);
            setSubcategory(""); // Reset subcategory when category changes
          }}
          value={category}
          className="w-full px-3 py-2"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory Dropdown */}
      <div>
        <p className="mb-2">Sub Category</p>
        <select
          onChange={(e) => setSubcategory(e.target.value)}
          value={subCategory}
          className="w-full px-3 py-2"
        >
          <option value="" disabled>
            Select a Sub Category
          </option>
          {category && subCategories[category]?.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CategorySelector;

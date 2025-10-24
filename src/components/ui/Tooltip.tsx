import React, { useState } from 'react';

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Tooltip({ content, children, className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex items-center"
        role="tooltip"
      >
        {children}
        <button 
          type="button" 
          className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="More information"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      </div>
      {isVisible && (
        <div 
          className="absolute z-50 w-64 p-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg"
          role="tooltip"
        >
          <div className="space-y-1">
            {content}
          </div>
          <div className="absolute w-3 h-3 -top-1.5 left-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}

type CategoryTooltipProps = {
  category: string;
  province?: string;
};

export function CategoryTooltip({ category, province = 'ON' }: CategoryTooltipProps) {
  const getCategoryInfo = () => {
    switch (category) {
      case 'Standard':
        return (
          <>
            <p className="font-medium">Standard Items</p>
            <p>Most goods and services</p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Tax:</strong> GST/HST + PST (where applicable)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Example: Electronics, furniture, clothing (adult)
            </p>
          </>
        );
      case 'Zero-rated (basic groceries)':
        return (
          <>
            <p className="font-medium">Basic Groceries</p>
            <p>Most food and beverages for home consumption</p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Tax:</strong> 0% GST/HST
              {['SK', 'MB', 'QC'].includes(province) && (
                <span>
                  , {province === 'QC' ? '9.975% QST' : province === 'MB' ? '7% PST' : '6% PST'}
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Example: Milk, bread, fruits, vegetables, meat
            </p>
            <p className="text-xs text-gray-500">
              Note: Prepared foods, snacks, and restaurant meals are taxed differently
            </p>
          </>
        );
      case 'Prepared food / restaurant':
        return (
          <>
            <p className="font-medium">Prepared Food & Restaurant Meals</p>
            <p>Food and beverages prepared by a restaurant or similar establishment</p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Tax:</strong> Full GST/HST + PST (where applicable)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Example: Restaurant meals, takeout, food court items
            </p>
          </>
        );
      case "Children's clothing & footwear":
        return (
          <>
            <p className="font-medium">Children's Clothing & Footwear</p>
            <p>Clothing and footwear for children under a certain age</p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Tax:</strong> Varies by province
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Example: Shirts, pants, shoes for children
            </p>
          </>
        );
      case 'Exempt':
        return (
          <>
            <p className="font-medium">Tax-Exempt Items</p>
            <p>Items exempt from all sales taxes</p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Tax:</strong> 0%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Example: Prescription drugs, basic groceries in most provinces
            </p>
          </>
        );
      default:
        return <p>Standard tax rates apply</p>;
    }
  };

  return (
    <Tooltip content={getCategoryInfo()}>
      <span>{category}</span>
    </Tooltip>
  );
}

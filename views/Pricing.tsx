
import React from 'react';

interface PricingTierProps {
  name: string;
  price: string;
  features: string[];
  isFeatured?: boolean;
}

const CheckIcon: React.FC = () => (
    <svg className="w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);


const PricingTier: React.FC<PricingTierProps> = ({ name, price, features, isFeatured = false }) => (
  <div className={`border rounded-xl p-8 flex flex-col ${isFeatured ? 'border-blue-500 border-2 shadow-2xl relative' : 'border-gray-200 bg-white'}`}>
    {isFeatured && <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">محبوب‌ترین</div>}
    <h3 className="text-2xl font-semibold">{name}</h3>
    <p className="mt-4">
      <span className="text-4xl font-bold">{price}</span>
      <span className="text-gray-500"> / ماه</span>
    </p>
    <p className="mt-4 text-gray-600">برای شروع کار با سرویس ما.</p>
    <ul className="mt-8 space-y-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <CheckIcon />
          <span className="mr-3 text-gray-700">{feature}</span>
        </li>
      ))}
    </ul>
    <button className={`mt-auto w-full py-3 rounded-lg font-semibold transition-colors ${isFeatured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
      انتخاب پلن
    </button>
  </div>
);


const Pricing: React.FC = () => {
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">پلن‌های اشتراک</h1>
        <p className="mt-2 text-lg text-gray-600">پلنی را انتخاب کنید که متناسب با نیاز شما باشد.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PricingTier
          name="رایگان"
          price="۰ تومان"
          features={['۵ رندر در ماه', 'دسترسی به مانکن‌های عمومی', 'کیفیت استاندارد', 'پشتیبانی از طریق ایمیل']}
        />
        <PricingTier
          name="حرفه‌ای"
          price="۱۹۹,۰۰۰ تومان"
          isFeatured={true}
          features={['۱۰۰ رندر در ماه', 'آپلود مانکن شخصی', 'کیفیت بالا (HD)', 'حذف واترمارک', 'پشتیبانی اولویت‌دار']}
        />
        <PricingTier
          name="فروشگاهی"
          price="۴۹۹,۰۰۰ تومان"
          features={['۵۰۰ رندر در ماه', 'تمام امکانات پلن حرفه‌ای', 'پردازش دسته‌ای محصولات', 'دسترسی API', 'مدیریت تیم']}
        />
      </div>
    </div>
  );
};

export default Pricing;

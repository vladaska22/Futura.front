import React, { useState, useMemo } from 'react';
import { 
  Filter,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data for Invoices
const mockInvoices = [
  {
    id: '736283',
    nickname: 'Nickname_3847',
    neededAmount: 1500,
    profit: 500,
    repayment: '26.05.2026'
  },
  {
    id: '736283',
    nickname: 'Nickname_3847',
    neededAmount: 1500,
    profit: 500,
    repayment: '26.05.2026'
  },
  {
    id: '736283',
    nickname: 'Nickname_3847',
    neededAmount: 1500,
    profit: 500,
    repayment: '26.05.2026'
  },
  {
    id: '736283',
    nickname: 'Nickname_3847',
    neededAmount: 1500,
    profit: 500,
    repayment: '26.05.2026'
  },
  {
    id: '736283',
    nickname: 'Nickname_3847',
    neededAmount: 1500,
    profit: 500,
    repayment: '26.05.2026'
  },
  {
    id: '736283',
    nickname: 'Nickname_3847',
    neededAmount: 1500,
    profit: 500,
    repayment: '26.05.2026'
  }
];

// Invoice Card Component
const InvoiceCard = ({ invoice, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    className="rounded-3xl bg-gradient-to-br from-purple-600/60 via-purple-700/40 to-purple-900/40 backdrop-blur-xl border border-purple-400/30 p-6 hover:border-purple-400/60 transition-all duration-300"
  >
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex-shrink-0 flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="7" r="3" />
          <path d="M10 12c-4 0-6 2-6 2v4h12v-4s-2-2-6-2z" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Title */}
        <h3 className="text-white font-semibold text-lg">{invoice.nickname}</h3>
        <p className="text-purple-200/70 text-sm">№ invoice {invoice.id}</p>

        {/* Info rows */}
        <div className="mt-3 space-y-1">
          <div className="flex gap-4">
            <span className="text-purple-200/70 text-xs">Needed amount:</span>
            <span className="text-white font-bold text-sm">{invoice.neededAmount}$</span>
          </div>
          <div className="flex gap-4">
            <span className="text-purple-200/70 text-xs">Profit:</span>
            <span className="text-white font-bold text-sm">{invoice.profit}$</span>
          </div>
          <div className="flex gap-4">
            <span className="text-purple-200/70 text-xs">Repayment:</span>
            <span className="text-white font-bold text-sm">{invoice.repayment}</span>
          </div>
        </div>
      </div>

      {/* More Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold text-sm transition-all duration-300 flex-shrink-0 self-center"
      >
        More
      </motion.button>
    </div>
  </motion.div>
);

// Filter Panel Component
const FilterPanel = ({ isOpen, onFilterChange, filters }) => {
  const handleCategoryChange = (category) => {
    const updated = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
      transition={{ duration: 0.3 }}
      className={`${isOpen ? 'block' : 'hidden'} w-80 rounded-3xl bg-white/10 backdrop-blur-xl border border-purple-400/20 p-6 sticky top-6 h-fit`}
    >
      {/* Filter by Field */}
      <div className="mb-6">
        <button className="w-full flex items-center justify-between text-purple-300 font-semibold mb-4 hover:text-purple-200 transition-colors">
          <span>Field</span>
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Filter by Amount */}
      <div className="mb-6">
        <button className="w-full flex items-center justify-between text-purple-300 font-semibold mb-4 hover:text-purple-200 transition-colors">
          <span>Amount</span>
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Filter by Due date */}
      <div className="mb-6">
        <button className="w-full flex items-center justify-between text-purple-300 font-semibold mb-4 hover:text-purple-200 transition-colors">
          <span>Due date</span>
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-white font-semibold text-sm mb-4">Categories</h4>
        <div className="space-y-3">
          {[
            'IT & Software Development',
            'Marketing & Advertising',
            'Logistics & Transportation',
            'E-commerce & Retail',
            'Professional Services & Consulting',
            'Creative Industries & Design',
            'Manufacturing & Supply'
          ].map((category) => (
            <label key={category} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="w-5 h-5 rounded border-2 border-purple-400/40 bg-transparent accent-purple-500 cursor-pointer"
              />
              <span className="text-purple-200/80 text-sm group-hover:text-purple-200 transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Main Dashboard Component
export const InvestorDashboard = () => {
  const [showFilter, setShowFilter] = useState(true);
  const [filters, setFilters] = useState({
    categories: []
  });

  const filteredInvoices = useMemo(() => {
    return mockInvoices;
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 text-white relative overflow-hidden">
      {/* Background animated orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-gradient-to-b from-purple-950/80 to-purple-900/40 backdrop-blur-xl border-b border-purple-400/20 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left side */}
              <div className="flex items-center gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    F
                  </div>
                  <span className="text-2xl font-bold">FuturaFlow</span>
                </motion.div>

                {/* Search */}
                <div className="hidden md:flex relative">
                  <input
                    type="text"
                    placeholder="Hinted search text"
                    className="pl-4 pr-10 py-2 rounded-full bg-gray-400/20 border border-gray-400/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 text-sm"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-6">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAACNKADAAQAAAABAAAB7AAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgB7AI0AwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBgQEBAQEBgcGBgYGBgYHBwcHBwcHBwgICAgICAkJCQkJCwsLCwsLCwsLC//bAEMBAgICAwMDBQMDBQsIBggLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLC//dAAQAJP/aAAwDAQACEQMRAD8A/uoooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==" 
                  alt="Profile Avatar" 
                  className="w-12 h-12 rounded-full border-2 border-purple-400/30 cursor-pointer object-cover" 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Filter Sidebar */}
            <div className="w-80">
              <motion.button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 text-white font-semibold mb-6 hover:text-pink-400 transition-colors"
              >
                <Filter size={24} className="text-pink-500" />
                <span>Filters</span>
              </motion.button>
              <FilterPanel isOpen={showFilter} onFilterChange={setFilters} filters={filters} />
            </div>

            {/* Invoices Grid */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {filteredInvoices.map((invoice, index) => (
                  <InvoiceCard key={index} invoice={invoice} index={index} />
                ))}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Export default for easy testing
export default InvestorDashboard;
import React, { useState, useRef } from 'react';
import { AlertCircle, File, X, Upload, CheckCircle, HelpCircle } from 'lucide-react';

const InvoiceCreation = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [formData, setFormData] = useState({
    amountNeeded: '',
    profitAmount: '',
    dueDate: '',
    repaymentDay: '',
    comment: '',
    agreedToTerms: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false); // For HelpCircle tooltip

  const fileInputRef = useRef(null);
  const dragOverCounter = useRef(0);

  // Available credit limit
  const availableLimit = 15000;

  // ============================================================================
  // VALIDATION FUNCTIONS
  // ============================================================================

  const calculateAPY = () => {
    const amount = parseFloat(formData.amountNeeded);
    const profit = parseFloat(formData.profitAmount);

    if (!amount || !profit || amount <= 0 || profit <= 0) {
      return null;
    }

    return ((profit / amount) * 100).toFixed(2);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation: Amount Needed
    const amount = parseFloat(formData.amountNeeded);
    if (!formData.amountNeeded) {
      newErrors.amountNeeded = 'Amount needed is required';
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amountNeeded = 'Amount must be a positive number';
    } else if (amount > availableLimit) {
      newErrors.amountNeeded = `Amount exceeds your available limit of $${availableLimit.toLocaleString()}`;
    }

    // Validation: Profit Amount
    const profit = parseFloat(formData.profitAmount);
    if (!formData.profitAmount) {
      newErrors.profitAmount = 'Profit amount is required';
    } else if (isNaN(profit) || profit <= 0) {
      newErrors.profitAmount = 'Profit must be a positive number';
    }

    // Validation: Due Date
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    // Validation: Repayment Day
    if (!formData.repaymentDay) {
      newErrors.repaymentDay = 'Repayment day is required';
    } else if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const repaymentDate = new Date(formData.repaymentDay);
      const minRepaymentDate = new Date(dueDate);
      minRepaymentDate.setDate(minRepaymentDate.getDate() + 1);

      if (repaymentDate < minRepaymentDate) {
        newErrors.repaymentDay = 'Repayment day must be at least 1 day after due date';
      }
    }

    // Validation: Comment Length
    if (formData.comment.length > 500) {
      newErrors.comment = `Comment exceeds 500 character limit (${formData.comment.length}/500)`;
    }

    // Validation: Files
    if (uploadedFiles.length === 0) {
      newErrors.files = 'At least one document is required';
    }

    // Validation: Terms Agreement
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================================
  // FILE HANDLING (SECURITY)
  // ============================================================================

  const ALLOWED_EXTENSIONS = ['pdf', 'jpeg', 'jpg', 'png'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const validateFile = (file) => {
    const extension = getFileExtension(file.name);

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: 'File size exceeds 5 MB limit',
      };
    }

    return { valid: true };
  };

  const handleFileSelect = (files) => {
    const newFiles = Array.from(files);
    const validFiles = [];

    newFiles.forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: (file.size / 1024).toFixed(2),
          file: file,
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          files: validation.error,
        }));
      }
    });

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.files;
        return newErrors;
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragOverCounter.current++;
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragOverCounter.current--;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragOverCounter.current = 0;

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // ============================================================================
  // INPUT HANDLERS
  // ============================================================================

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === 'comment') {
      // Sanitization: Limit to 500 chars and remove dangerous characters
      const sanitized = value
        .slice(0, 500)
        .replace(/[<>]/g, ''); // Basic XSS prevention
      setFormData((prev) => ({
        ...prev,
        [name]: sanitized,
      }));
    } else if (name === 'amountNeeded' || name === 'profitAmount') {
      // Only allow positive numbers and decimal point
      const sanitized = value.replace(/[^0-9.]/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: sanitized,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // ============================================================================
  // SUBMIT HANDLER
  // ============================================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitStatus(null);

    try {
      // Prepare payload for API
      const formPayload = new FormData();
      formPayload.append('amountNeeded', formData.amountNeeded);
      formPayload.append('profitAmount', formData.profitAmount);
      formPayload.append('dueDate', formData.dueDate);
      formPayload.append('repaymentDay', formData.repaymentDay);
      formPayload.append('comment', formData.comment);
      formPayload.append('apy', calculateAPY());

      // Append files
      uploadedFiles.forEach((fileObj, index) => {
        formPayload.append(`files_${index}`, fileObj.file);
      });

      // Simulate API call (replace with real API endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock success
      console.log('Form submitted:', {
        ...formData,
        apy: calculateAPY(),
        filesCount: uploadedFiles.length,
      });

      setSubmitStatus({
        type: 'success',
        message: 'Invoice created successfully!',
      });

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          amountNeeded: '',
          profitAmount: '',
          dueDate: '',
          repaymentDay: '',
          comment: '',
          agreedToTerms: false,
        });
        setUploadedFiles([]);
        setErrors({});
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to create invoice. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const apy = calculateAPY();

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-[#240b45] bg-gradient-to-br from-[#240b45] via-[#2d1555] to-[#1a0535] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000" />
      </div>

      <div className="relative z-10">
        {/* ====== HEADER ====== */}
        <header className="border-b border-purple-400/20 backdrop-blur-sm bg-white/5">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <h1 className="text-white font-bold text-xl">FuturaFlow</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-purple-400/20">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full" />
                <span className="text-white text-sm font-medium">User</span>
              </div>
            </div>
          </div>
        </header>

        {/* ====== MAIN CONTENT ====== */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Create New Invoice</h2>
              <p className="text-purple-100 text-sm mt-1">
                Complete all fields to generate your invoice agreement
              </p>
            </div>

            {/* Submit Status Messages */}
            {submitStatus && (
              <div
                className={`mx-8 mt-6 p-4 rounded-lg border flex gap-3 items-start ${
                  submitStatus.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                {submitStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <p
                  className={`text-sm font-medium ${
                    submitStatus.type === 'success'
                      ? 'text-emerald-800'
                      : 'text-red-800'
                  }`}
                >
                  {submitStatus.message}
                </p>
              </div>
            )}

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="px-8 py-8">
              {/* ====== ROW 1: AMOUNT FIELDS ====== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Amount Needed */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Amount Needed
                    <span className="text-red-500 ml-1">*</span>
                    <span className="text-xs text-gray-500 font-normal ml-2">
                      (Available limit: ${availableLimit.toLocaleString()})
                    </span>
                  </label>
                  <input
                    type="text"
                    name="amountNeeded"
                    placeholder="e.g., 50000"
                    value={formData.amountNeeded}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-mono text-lg transition-colors ${
                      errors.amountNeeded
                        ? 'border-red-500 bg-red-50 focus:outline-none'
                        : 'border-gray-300 bg-white focus:border-purple-500 focus:bg-white'
                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  />
                  {errors.amountNeeded && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1 items-center">
                      <AlertCircle className="w-4 h-4" />
                      {errors.amountNeeded}
                    </p>
                  )}
                </div>

                {/* Profit Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Profit Amount
                    <span className="text-red-500 ml-1">*</span>
                    {apy && (
                      <span className="text-xs text-gray-500 font-normal ml-2">
                        ({apy}% APY)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="profitAmount"
                    placeholder="e.g., 5000"
                    value={formData.profitAmount}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-mono text-lg transition-colors ${
                      errors.profitAmount
                        ? 'border-red-500 bg-red-50 focus:outline-none'
                        : 'border-gray-300 bg-white focus:border-purple-500 focus:bg-white'
                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  />
                  {errors.profitAmount && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1 items-center">
                      <AlertCircle className="w-4 h-4" />
                      {errors.profitAmount}
                    </p>
                  )}
                </div>
              </div>

              {/* ====== ROW 2: DATE FIELDS ====== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Due Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Due Date
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                      errors.dueDate
                        ? 'border-red-500 bg-red-50 focus:outline-none'
                        : 'border-gray-300 bg-white focus:border-purple-500 focus:bg-white'
                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  />
                  {errors.dueDate && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1 items-center">
                      <AlertCircle className="w-4 h-4" />
                      {errors.dueDate}
                    </p>
                  )}
                </div>

                {/* Repayment Day */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Repayment Day
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="date"
                    name="repaymentDay"
                    value={formData.repaymentDay}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                      errors.repaymentDay
                        ? 'border-red-500 bg-red-50 focus:outline-none'
                        : 'border-gray-300 bg-white focus:border-purple-500 focus:bg-white'
                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  />
                  {errors.repaymentDay && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1 items-center">
                      <AlertCircle className="w-4 h-4" />
                      {errors.repaymentDay}
                    </p>
                  )}
                </div>
              </div>

              {/* ====== ROW 3: COMMENT FIELD ====== */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Comment
                  <span className="text-gray-500 text-xs font-normal ml-2">
                    ({formData.comment.length}/500)
                  </span>
                </label>
                <textarea
                  name="comment"
                  placeholder="Add any additional notes or terms..."
                  value={formData.comment}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  maxLength={500}
                  rows="4"
                  className={`w-full px-4 py-3 border-2 rounded-lg font-sans resize-none transition-colors ${
                    errors.comment
                      ? 'border-red-500 bg-red-50 focus:outline-none'
                      : 'border-gray-300 bg-white focus:border-purple-500 focus:bg-white'
                  } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                />
                {errors.comment && (
                  <p className="text-red-600 text-sm mt-1 flex gap-1 items-center">
                    <AlertCircle className="w-4 h-4" />
                    {errors.comment}
                  </p>
                )}
              </div>

              {/* ====== ROW 4: FILE UPLOAD WITH CLICKABLE HELP ICON ====== */}
              <div className="mb-6">
                {/* Label з кліваною іконкою Допомога */}
                <div className="flex items-center gap-2 mb-2 relative">
                  <label className="text-sm font-semibold text-gray-800">
                    Upload Invoice & Act of Acceptance
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  {/* 🎯 CLICKABLE HELP ICON WITH TOOLTIP */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTooltip(!showTooltip)}
                      className="inline-flex items-center justify-center w-5 h-5 text-gray-400 hover:text-purple-600 hover:bg-purple-100 rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-1"
                      title="Get help about documents"
                      aria-label="Help: Information about required documents"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>

                    {/* Tooltip - appears on click */}
                    {showTooltip && (
                      <>
                        {/* Background overlay - closes tooltip on tap */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowTooltip(false)}
                        />

                        {/* Tooltip content */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-2xl z-50">
                          <p className="leading-relaxed">
                            Це документ (PDF), який ви виставили клієнту для оплати, та підписаний акт. Ви можете завантажити його з вашого бухгалтерського сервісу (наприклад, Fainsta або Taxer) або створити за шаблоном у Word/PDF.
                          </p>
                          {/* Arrow pointing down */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-gray-500 text-xs font-normal mb-3">
                  (PDF, JPEG, PNG - Max 5 MB each)
                </p>

                {/* Drag & Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    dragOverCounter.current > 0
                      ? 'border-purple-500 bg-purple-50'
                      : errors.files
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !isLoading && fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-gray-700 font-medium">
                    Drag and drop your documents here or click to select
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Please upload PDF, JPEG, or PNG (Max 5 MB each)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    hidden
                    accept=".pdf,.jpeg,.jpg,.png"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    disabled={isLoading}
                  />
                </div>

                {errors.files && (
                  <p className="text-red-600 text-sm mt-2 flex gap-1 items-center font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {errors.files}
                  </p>
                )}

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                      {uploadedFiles.length} file(s) uploaded
                    </p>
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <File className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {file.size} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          disabled={isLoading}
                          className="ml-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Remove file"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ====== ROW 5: TERMS AGREEMENT ====== */}
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    id="terms"
                    checked={formData.agreedToTerms}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer flex-shrink-0 mt-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    <span className="font-semibold">
                      I confirm that the Act of Acceptance is signed by both
                      parties and I agree to the cession terms
                    </span>
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
                {errors.agreedToTerms && (
                  <p className="text-red-600 text-sm mt-2 ml-8 flex gap-1 items-center">
                    <AlertCircle className="w-4 h-4" />
                    {errors.agreedToTerms}
                  </p>
                )}
              </div>

              {/* ====== SUBMIT BUTTON ====== */}
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.agreedToTerms ||
                  uploadedFiles.length === 0
                }
                className={`w-full py-3 px-6 rounded-xl font-semibold text-white text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  isLoading ||
                  !formData.agreedToTerms ||
                  uploadedFiles.length === 0
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 active:scale-95 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating invoice...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Create Invoice
                  </>
                )}
              </button>
            </form>

            {/* Card Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-8 py-4">
              <p className="text-xs text-gray-600 text-center">
                🔒 Your data is encrypted and stored securely. No sensitive data
                is logged.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InvoiceCreation;

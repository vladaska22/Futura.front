import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CreditCard,
  DollarSign,
  Lock,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Info,
  ArrowRight,
  Shield,
  ArrowLeft,
  XCircle,
} from 'lucide-react';

const GetPayoutPage = ({ availableBalance = 15000 }) => {
  const navigate = useNavigate();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [step, setStep] = useState('amount');
  const [formData, setFormData] = useState({
    amount: '',
    method: 'card',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    ibanCode: '',
    verificationCode: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const MINIMUM_WITHDRAWAL = 10;
  const NETWORK_FEE_PERCENT = 1.5;

  // ============================================================================
  // CALCULATIONS
  // ============================================================================

  const withdrawalAmount = parseFloat(formData.amount) || 0;
  const networkFee = (withdrawalAmount * NETWORK_FEE_PERCENT) / 100;
  const totalDeduction = withdrawalAmount + networkFee;
  const canWithdraw = totalDeduction <= availableBalance;

  // ============================================================================
  // VALIDATION FUNCTIONS
  // ============================================================================

  const validateAmount = () => {
    const newErrors = {};

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) < MINIMUM_WITHDRAWAL) {
      newErrors.amount = `Minimum withdrawal is $${MINIMUM_WITHDRAWAL}`;
    } else if (parseFloat(formData.amount) > availableBalance) {
      newErrors.amount = `Amount exceeds available balance`;
    } else if (totalDeduction > availableBalance) {
      newErrors.amount = `Insufficient balance after fees ($${networkFee.toFixed(2)})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentMethod = () => {
    const newErrors = {};

    if (formData.method === 'card') {
      // Видаляємо пробіли для перевірки
      const cardNumberDigits = formData.cardNumber.replace(/\s/g, '');
      
      if (!cardNumberDigits) {
        newErrors.cardNumber = 'Card number is required';
      } else if (cardNumberDigits.length < 13) {
        newErrors.cardNumber = 'Valid card number required (13+ digits)';
      }

      if (!formData.cardHolder || formData.cardHolder.trim() === '') {
        newErrors.cardHolder = 'Cardholder name is required';
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Format must be MM/YY';
      }
    } else if (formData.method === 'iban') {
      if (!formData.ibanCode || formData.ibanCode.trim() === '') {
        newErrors.ibanCode = 'IBAN code is required';
      } else if (formData.ibanCode.length < 15) {
        newErrors.ibanCode = 'Valid IBAN required (15+ characters)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVerification = () => {
    const newErrors = {};

    if (!formData.verificationCode) {
      newErrors.verificationCode = '6-digit code is required';
    } else if (formData.verificationCode.length !== 6) {
      newErrors.verificationCode = 'Code must be exactly 6 digits';
    } else if (!/^\d+$/.test(formData.verificationCode)) {
      newErrors.verificationCode = 'Code must contain only numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'amount') {
      const sanitized = value.replace(/[^0-9.]/g, '');
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
    } else if (name === 'cardNumber') {
      const sanitized = value.replace(/[^0-9]/g, '').slice(0, 19);
      const formatted = sanitized
        .match(/.{1,4}/g)
        ?.join(' ')
        .trim() || sanitized;
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === 'expiryDate') {
      let sanitized = value.replace(/[^0-9]/g, '');
      if (sanitized.length >= 2) {
        sanitized = sanitized.slice(0, 2) + '/' + sanitized.slice(2, 4);
      }
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
    } else if (name === 'verificationCode') {
      const sanitized = value.replace(/[^0-9]/g, '').slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNextStep = async () => {
    // КРОК 1: СУМА
    if (step === 'amount') {
      if (!validateAmount()) {
        console.log('Amount validation failed:', errors);
        return;
      }
      console.log('Amount validated, moving to method step');
      setStep('method');
      return;
    }

    // КРОК 2: МЕТОД ОПЛАТИ
    if (step === 'method') {
      if (!validatePaymentMethod()) {
        console.log('Payment method validation failed:', errors);
        return;
      }
      console.log('Payment method validated, moving to verification step');
      setStep('verification');
      return;
    }

    // КРОК 3: ВЕРИФІКАЦІЯ
    if (step === 'verification') {
      if (!validateVerification()) {
        console.log('Verification validation failed:', errors);
        return;
      }

      // Симуляція 2FA
      setIsLoading(true);
      console.log('Starting 2FA verification...');

      try {
        // Симуляція API запиту (успіх 80%, помилка 20%)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Рандомна успіх/помилка для демо
        const isSuccess = Math.random() > 0.2;

        if (isSuccess) {
          setIsLoading(false);
          setSuccessMessage(
            `$${withdrawalAmount.toFixed(2)} will be transferred to your ${
              formData.method === 'card' ? 'card' : 'IBAN'
            } within 1-2 business days.`
          );
          setShowSuccessModal(true);
          console.log('Payment successful!');
        } else {
          setIsLoading(false);
          setErrorMessage('Verification failed. Please check the code and try again.');
          setShowErrorModal(true);
          console.log('Verification failed');
        }
      } catch (error) {
        setIsLoading(false);
        setErrorMessage('An error occurred. Please try again.');
        setShowErrorModal(true);
        console.error('Error:', error);
      }
    }
  };

  const handlePreviousStep = () => {
    if (step === 'method') {
      setStep('amount');
    } else if (step === 'verification') {
      setStep('method');
    }
    setErrors({});
  };

  const handleExit = () => {
    navigate('/dashboard');
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Після 2 сек автоматично повертаємося на дашборд
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handleErrorClose = () => {
    setShowErrorModal(false);
    // Повертаємось на крок верифікації
    setStep('verification');
    setFormData((prev) => ({ ...prev, verificationCode: '' }));
  };

  // ============================================================================
  // RENDER HELPER: STEP 1 - AMOUNT
  // ============================================================================

  const renderAmountStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 border border-emerald-400/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-200/70 text-sm font-medium mb-1">
              Available for Payout
            </p>
            <h3 className="text-4xl font-bold text-white">
              ${availableBalance.toFixed(2)}
            </h3>
          </div>
          <DollarSign className="w-12 h-12 text-emerald-400 opacity-30" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-white mb-3">
          Withdrawal Amount
          <span className="text-red-400 ml-1">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-semibold">
            $
          </span>
          <input
            type="text"
            name="amount"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleInputChange}
            className={`w-full pl-8 pr-4 py-4 bg-white/5 border-2 rounded-xl text-white text-lg placeholder-white/30 transition-all ${
              errors.amount
                ? 'border-red-400/50 bg-red-400/5 focus:outline-none'
                : 'border-white/10 focus:border-cyan-400/50 focus:outline-none'
            }`}
          />
        </div>
        {errors.amount && (
          <p className="text-red-400 text-sm mt-2 flex gap-2 items-center">
            <AlertCircle className="w-4 h-4" />
            {errors.amount}
          </p>
        )}
      </div>

      {withdrawalAmount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"
        >
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Amount:</span>
            <span className="text-white">${withdrawalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Fee ({NETWORK_FEE_PERCENT}%):</span>
            <span className="text-orange-400">+${networkFee.toFixed(2)}</span>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex justify-between text-sm">
            <span className="text-white font-semibold">Total Deduction:</span>
            <span
              className={`font-bold ${
                canWithdraw ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              ${totalDeduction.toFixed(2)}
            </span>
          </div>
          {!canWithdraw && (
            <p className="text-red-400 text-xs mt-2">
              ⚠️ Insufficient balance including fees
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );

  // ============================================================================
  // RENDER HELPER: STEP 2 - METHOD
  // ============================================================================

  const renderMethodStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <p className="text-white/60 text-sm">Payout Amount</p>
        <p className="text-2xl font-bold text-cyan-400">
          ${withdrawalAmount.toFixed(2)}
        </p>
        <p className="text-white/40 text-xs mt-2">
          Fee: ${networkFee.toFixed(2)}
        </p>
      </div>

      <div>
        <p className="text-sm font-semibold text-white mb-3">
          Payout Method <span className="text-red-400">*</span>
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              setFormData((prev) => ({ ...prev, method: 'card' }));
              setErrors({});
            }}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
              formData.method === 'card'
                ? 'border-cyan-400/50 bg-cyan-400/10'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <CreditCard
              className={`w-5 h-5 ${
                formData.method === 'card'
                  ? 'text-cyan-400'
                  : 'text-white/50'
              }`}
            />
            <span className="text-white font-medium text-sm">Bank Card</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData((prev) => ({ ...prev, method: 'iban' }));
              setErrors({});
            }}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
              formData.method === 'iban'
                ? 'border-purple-400/50 bg-purple-400/10'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <Shield
              className={`w-5 h-5 ${
                formData.method === 'iban'
                  ? 'text-purple-400'
                  : 'text-white/50'
              }`}
            />
            <span className="text-white font-medium text-sm">IBAN</span>
          </button>
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-4">
        {formData.method === 'card' ? (
          <>
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleInputChange}
                maxLength="19"
                className={`w-full px-4 py-3 bg-white/5 border-2 rounded-lg text-white placeholder-white/30 transition-all ${
                  errors.cardNumber
                    ? 'border-red-400/50 focus:outline-none'
                    : 'border-white/10 focus:border-cyan-400/50 focus:outline-none'
                }`}
              />
              {errors.cardNumber && (
                <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                name="cardHolder"
                placeholder="JOHN DOE"
                value={formData.cardHolder}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/5 border-2 rounded-lg text-white placeholder-white/30 transition-all ${
                  errors.cardHolder
                    ? 'border-red-400/50 focus:outline-none'
                    : 'border-white/10 focus:border-cyan-400/50 focus:outline-none'
                }`}
              />
              {errors.cardHolder && (
                <p className="text-red-400 text-xs mt-1">{errors.cardHolder}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2">
                Expiry Date (MM/YY) *
              </label>
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleInputChange}
                maxLength="5"
                className={`w-full px-4 py-3 bg-white/5 border-2 rounded-lg text-white placeholder-white/30 transition-all ${
                  errors.expiryDate
                    ? 'border-red-400/50 focus:outline-none'
                    : 'border-white/10 focus:border-cyan-400/50 focus:outline-none'
                }`}
              />
              {errors.expiryDate && (
                <p className="text-red-400 text-xs mt-1">{errors.expiryDate}</p>
              )}
            </div>
          </>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2">
              IBAN Code *
            </label>
            <input
              type="text"
              name="ibanCode"
              placeholder="DE89370400440532013000"
              value={formData.ibanCode}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white/5 border-2 rounded-lg text-white placeholder-white/30 transition-all ${
                errors.ibanCode
                  ? 'border-red-400/50 focus:outline-none'
                  : 'border-white/10 focus:border-cyan-400/50 focus:outline-none'
              }`}
            />
            {errors.ibanCode && (
              <p className="text-red-400 text-xs mt-1">{errors.ibanCode}</p>
            )}
          </div>
        )}
      </div>

      {/* Security Tips */}
      <div className="bg-amber-400/10 border border-amber-400/20 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-200 font-medium text-sm mb-2">
              Security Tips:
            </p>
            <ul className="text-amber-100/70 text-xs space-y-1">
              <li>• FuturaFlow will never ask for your CVV or PIN</li>
              <li>• Verify all details before confirming</li>
              <li>• Check bank statements after transfer</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ============================================================================
  // RENDER HELPER: STEP 3 - 2FA
  // ============================================================================

  const renderVerificationStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 text-center"
    >
      <div className="w-16 h-16 bg-purple-400/10 border border-purple-400/20 rounded-full flex items-center justify-center mx-auto">
        <Lock className="w-8 h-8 text-purple-400" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-2">
          Security Verification
        </h3>
        <p className="text-white/50 text-sm">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-white/70 mb-3">
          Verification Code *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="verificationCode"
            placeholder="000000"
            value={formData.verificationCode}
            onChange={handleInputChange}
            maxLength="6"
            className={`w-full px-4 py-4 bg-white/5 border-2 rounded-xl text-center text-3xl tracking-widest font-mono text-white placeholder-white/30 transition-all ${
              errors.verificationCode
                ? 'border-red-400/50 focus:outline-none'
                : 'border-white/10 focus:border-purple-400/50 focus:outline-none'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.verificationCode && (
          <p className="text-red-400 text-sm mt-2">
            {errors.verificationCode}
          </p>
        )}
      </div>

      <p className="text-white/40 text-xs">Code expires in 10 minutes</p>

      {/* Final Summary */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Amount:</span>
          <span className="text-white font-medium">
            ${withdrawalAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Fee:</span>
          <span className="text-orange-400">-${networkFee.toFixed(2)}</span>
        </div>
        <div className="h-px bg-white/10" />
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Method:</span>
          <span className="text-cyan-400 font-medium">
            {formData.method === 'card' ? 'Bank Card' : 'IBAN Transfer'}
          </span>
        </div>
      </div>
    </motion.div>
  );

  // ============================================================================
  // SUCCESS MODAL
  // ============================================================================

  const SuccessModal = () => (
    <AnimatePresence>
      {showSuccessModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gradient-to-br from-[#240b45]/90 via-[#2d1555]/90 to-[#1a0535]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 max-w-md w-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                className="flex justify-center mb-6"
              >
                <div className="w-20 h-20 bg-emerald-400/10 border border-emerald-400/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
              </motion.div>

              <h2 className="text-3xl font-bold text-white text-center mb-3">
                Payout Confirmed!
              </h2>

              <p className="text-white/60 text-center mb-6">
                {successMessage}
              </p>

              <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-4 mb-6">
                <p className="text-emerald-200 text-sm text-center">
                  ✓ Confirmation email has been sent
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSuccessClose}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold hover:from-emerald-600 hover:to-cyan-700 transition-all"
              >
                Back to Dashboard
              </motion.button>

              <p className="text-white/40 text-xs text-center mt-4">
                Redirecting in 3 seconds...
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // ============================================================================
  // ERROR MODAL
  // ============================================================================

  const ErrorModal = () => (
    <AnimatePresence>
      {showErrorModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gradient-to-br from-[#240b45]/90 via-[#2d1555]/90 to-[#1a0535]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 max-w-md w-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                className="flex justify-center mb-6"
              >
                <div className="w-20 h-20 bg-red-400/10 border border-red-400/20 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-400" />
                </div>
              </motion.div>

              <h2 className="text-3xl font-bold text-white text-center mb-3">
                Verification Failed
              </h2>

              <p className="text-white/60 text-center mb-6">
                {errorMessage}
              </p>

              <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4 mb-6">
                <p className="text-red-200 text-sm text-center">
                  ⚠️ Please check the code and try again
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleErrorClose}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold hover:from-red-600 hover:to-orange-700 transition-all"
              >
                Try Again
              </motion.button>

              <p className="text-white/40 text-xs text-center mt-4">
                Check your email for the verification code
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen w-full bg-[#240b45] bg-gradient-to-br from-[#240b45] via-[#2d1555] to-[#1a0535] flex flex-col relative overflow-hidden font-sans text-white">
      {/* HEADER */}
      <header className="w-full border-b border-white/10 backdrop-blur-sm bg-white/5 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleExit}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">
              FuturaFlow
              <span className="text-white/40 font-normal ml-2">| Payout</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-emerald-300">
            <DollarSign size={16} /> Balance: ${availableBalance.toFixed(2)}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, type: 'spring' }}
          className="w-full max-w-lg"
        >
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            {step !== 'success' && (
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {step === 'amount'
                    ? 'Enter Amount'
                    : step === 'method'
                    ? 'Select Method'
                    : 'Verification'}
                </h2>
                <div className="text-xs text-white/40 font-mono">
                  Step {step === 'amount' ? '1' : step === 'method' ? '2' : '3'} /
                  3
                </div>
              </div>
            )}

            <div className="p-8">
              <AnimatePresence mode="wait">
                {step === 'amount' && renderAmountStep()}
                {step === 'method' && renderMethodStep()}
                {step === 'verification' && renderVerificationStep()}
              </AnimatePresence>
            </div>

            <div className="p-8 border-t border-white/10 bg-black/10 flex gap-4">
              {step !== 'verification' ? (
                <>
                  {step !== 'amount' && (
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-medium transition-colors"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleNextStep}
                    disabled={
                      isLoading ||
                      (step === 'amount' && (!withdrawalAmount || !canWithdraw))
                    }
                    className="flex-grow py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handlePreviousStep}
                    className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={isLoading || !formData.verificationCode}
                    className="flex-grow py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Confirm Payout <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* MODALS */}
      <SuccessModal />
      <ErrorModal />
    </div>
  );
};

export default GetPayoutPage;

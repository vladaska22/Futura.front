import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import InvoiceCreation from '../components/Invoicecreation';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock lucide-react icons so they render as simple spans (no SVG issues)
vi.mock('lucide-react', () => ({
  AlertCircle: ({ className }) => <span className={className} data-testid="icon-alert" />,
  File: ({ className }) => <span className={className} data-testid="icon-file" />,
  X: ({ className }) => <span className={className} data-testid="icon-x" />,
  Upload: ({ className }) => <span className={className} data-testid="icon-upload" />,
  CheckCircle: ({ className }) => <span className={className} data-testid="icon-check" />,
  HelpCircle: ({ className }) => <span className={className} data-testid="icon-help" />,
}));

// Helper: get a future date string in YYYY-MM-DD format
function futureDateString(daysFromNow = 10) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

// Helper: get a past date string
function pastDateString(daysAgo = 5) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

// Create a mock File with exact byte count
function createMockFile(name, size, type) {
  const content = new Uint8Array(size);
  return new File([content], name, { type });
}

// Upload a valid PDF via fireEvent (works with hidden file inputs)
function uploadFile(file) {
  const fileInput = document.querySelector('input[type="file"]');
  fireEvent.change(fileInput, { target: { files: [file] } });
}

function uploadValidPdf() {
  uploadFile(createMockFile('invoice.pdf', 1024, 'application/pdf'));
}

// ============================================================
// UNIT: validateForm
// ============================================================
describe('InvoiceCreation — Unit: validateForm', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('shows error when amountNeeded is empty', async () => {
    const user = userEvent.setup();
    render(<InvoiceCreation />);

    // Upload file and check terms so only amountNeeded triggers this error
    uploadValidPdf();
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    fireEvent.submit(document.querySelector('form'));

    expect(screen.getByText('Amount needed is required')).toBeInTheDocument();
  });

  it('shows error when amountNeeded is zero', async () => {
    const user = userEvent.setup();
    render(<InvoiceCreation />);

    fireEvent.change(screen.getByPlaceholderText('e.g., 50000'), {
      target: { name: 'amountNeeded', value: '0' },
    });
    uploadValidPdf();
    await user.click(screen.getByRole('checkbox'));
    fireEvent.submit(document.querySelector('form'));

    expect(screen.getByText('Amount must be a positive number')).toBeInTheDocument();
  });

  it('shows error when amountNeeded exceeds available limit of $15,000', async () => {
    const user = userEvent.setup();
    render(<InvoiceCreation />);

    fireEvent.change(screen.getByPlaceholderText('e.g., 50000'), {
      target: { name: 'amountNeeded', value: '20000' },
    });
    uploadValidPdf();
    await user.click(screen.getByRole('checkbox'));
    fireEvent.submit(document.querySelector('form'));

    expect(screen.getByText(/exceeds your available limit/i)).toBeInTheDocument();
  });

  it('shows error when profitAmount is empty', async () => {
    const user = userEvent.setup();
    render(<InvoiceCreation />);

    fireEvent.change(screen.getByPlaceholderText('e.g., 50000'), {
      target: { name: 'amountNeeded', value: '5000' },
    });
    uploadValidPdf();
    await user.click(screen.getByRole('checkbox'));
    fireEvent.submit(document.querySelector('form'));

    expect(screen.getByText('Profit amount is required')).toBeInTheDocument();
  });

  it('shows error when profitAmount is zero', async () => {
    const user = userEvent.setup();
    render(<InvoiceCreation />);

    fireEvent.change(screen.getByPlaceholderText('e.g., 50000'), {
      target: { name: 'amountNeeded', value: '5000' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g., 5000'), {
      target: { name: 'profitAmount', value: '0' },
    });
    uploadValidPdf();
    await user.click(screen.getByRole('checkbox'));
    fireEvent.submit(document.querySelector('form'));

    expect(screen.getByText('Profit must be a positive number')).toBeInTheDocument();
  });

  it('shows error when dueDate is in the past', async () => {
    const user = userEvent.setup();
    render(<InvoiceCreation />);

    fireEvent.change(screen.getByPlaceholderText('e.g., 50000'), {
      target: { name: 'amountNeeded', value: '5000' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g., 5000'), {
      target: { name: 'profitAmount', value: '500' },
    });
    fireEvent.change(document.querySelector('input[name="dueDate"]'), {
      target: { name: 'dueDate', value: pastDateString(5) },
    });
    uploadValidPdf();
    await user.click(screen.getByRole('checkbox'));
    fireEvent.submit(document.querySelector('form'));

    expect(screen.getByText('Due date cannot be in the past')).toBeInTheDocument();
  });

  it('shows error when repaymentDay is same as dueDate (needs +1 day)', async () => {
    const user = userEvent.setup();
    render(<InvoiceCreation />);

    const sameDateFuture = futureDateString(5);

    fireEvent.change(screen.getByPlaceholderText('e.g., 50000'), {
      target: { name: 'amountNeeded', value: '5000' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g., 5000'), {
      target: { name: 'profitAmount', value: '500' },
    });
    fireEvent.change(document.querySelector('input[name="dueDate"]'), {
      target: { name: 'dueDate', value: sameDateFuture },
    });
    fireEvent.change(document.querySelector('input[name="repaymentDay"]'), {
      target: { name: 'repaymentDay', value: sameDateFuture },
    });
    uploadValidPdf();
    await user.click(screen.getByRole('checkbox'));
    fireEvent.submit(document.querySelector('form'));

    expect(
      screen.getByText(/repayment day must be at least 1 day after due date/i)
    ).toBeInTheDocument();
  });

  it('shows error when repaymentDay is before dueDate', async () => {
    const user = userEvent.setup();
    render(<InvoiceCreation />);

    fireEvent.change(screen.getByPlaceholderText('e.g., 50000'), {
      target: { name: 'amountNeeded', value: '5000' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g., 5000'), {
      target: { name: 'profitAmount', value: '500' },
    });
    // due date 10 days from now
    fireEvent.change(document.querySelector('input[name="dueDate"]'), {
      target: { name: 'dueDate', value: futureDateString(10) },
    });
    // repayment 5 days from now (before due date)
    fireEvent.change(document.querySelector('input[name="repaymentDay"]'), {
      target: { name: 'repaymentDay', value: futureDateString(5) },
    });
    uploadValidPdf();
    await user.click(screen.getByRole('checkbox'));
    fireEvent.submit(document.querySelector('form'));

    expect(
      screen.getByText(/repayment day must be at least 1 day after due date/i)
    ).toBeInTheDocument();
  });

  it('shows error when no files uploaded', () => {
    render(<InvoiceCreation />);
    fireEvent.submit(document.querySelector('form'));
    expect(screen.getByText('At least one document is required')).toBeInTheDocument();
  });

  it('shows error when terms not agreed', () => {
    render(<InvoiceCreation />);
    fireEvent.submit(document.querySelector('form'));
    expect(screen.getByText('You must agree to the terms')).toBeInTheDocument();
  });
});

// ============================================================
// UNIT: calculateAPY
// ============================================================
describe('InvoiceCreation — Unit: calculateAPY', () => {
  it('shows APY = 10.00% for amount=10000 and profit=1000', () => {
    render(<InvoiceCreation />);

    fireEvent.change(screen.getByPlaceholderText('e.g., 50000'), {
      target: { name: 'amountNeeded', value: '10000' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g., 5000'), {
      target: { name: 'profitAmount', value: '1000' },
    });

    expect(screen.getByText(/10\.00% APY/)).toBeInTheDocument();
  });

  it('does not show APY when only amountNeeded is filled', () => {
    render(<InvoiceCreation />);

    fireEvent.change(screen.getByPlaceholderText('e.g., 50000'), {
      target: { name: 'amountNeeded', value: '10000' },
    });

    expect(screen.queryByText(/APY/)).not.toBeInTheDocument();
  });

  it('calculates APY = 5.00% for amount=5000 and profit=250', () => {
    render(<InvoiceCreation />);

    fireEvent.change(screen.getByPlaceholderText('e.g., 50000'), {
      target: { name: 'amountNeeded', value: '5000' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g., 5000'), {
      target: { name: 'profitAmount', value: '250' },
    });

    expect(screen.getByText(/5\.00% APY/)).toBeInTheDocument();
  });

  it('calculates APY = 20.00% for amount=1000 and profit=200', () => {
    render(<InvoiceCreation />);

    fireEvent.change(screen.getByPlaceholderText('e.g., 50000'), {
      target: { name: 'amountNeeded', value: '1000' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g., 5000'), {
      target: { name: 'profitAmount', value: '200' },
    });

    expect(screen.getByText(/20\.00% APY/)).toBeInTheDocument();
  });
});

// ============================================================
// UNIT: file validation
// ============================================================
describe('InvoiceCreation — Unit: file validation', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('rejects a file with wrong extension (.txt) and shows error', () => {
    render(<InvoiceCreation />);

    const badFile = createMockFile('document.txt', 1024, 'text/plain');
    uploadFile(badFile);

    expect(screen.getByText(/Invalid file type/i)).toBeInTheDocument();
  });

  it('rejects a file that is too large (>5MB) and shows error', () => {
    render(<InvoiceCreation />);

    const bigFile = createMockFile('large.pdf', 6 * 1024 * 1024, 'application/pdf');
    uploadFile(bigFile);

    expect(screen.getByText('File size exceeds 5 MB limit')).toBeInTheDocument();
  });

  it('accepts a valid PDF file (under 5MB) and shows its name', () => {
    render(<InvoiceCreation />);

    uploadFile(createMockFile('invoice.pdf', 100 * 1024, 'application/pdf'));

    expect(screen.getByText('invoice.pdf')).toBeInTheDocument();
  });

  it('accepts a valid JPEG file and shows its name', () => {
    render(<InvoiceCreation />);

    uploadFile(createMockFile('photo.jpg', 500 * 1024, 'image/jpeg'));

    expect(screen.getByText('photo.jpg')).toBeInTheDocument();
  });

  it('accepts a valid PNG file and shows its name', () => {
    render(<InvoiceCreation />);

    uploadFile(createMockFile('scan.png', 300 * 1024, 'image/png'));

    expect(screen.getByText('scan.png')).toBeInTheDocument();
  });

  it('shows "1 file(s) uploaded" after uploading one valid file', () => {
    render(<InvoiceCreation />);

    uploadFile(createMockFile('invoice.pdf', 1024, 'application/pdf'));

    expect(screen.getByText(/1 file\(s\) uploaded/i)).toBeInTheDocument();
  });

  it('removes a file when the remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<InvoiceCreation />);

    uploadFile(createMockFile('to-remove.pdf', 1024, 'application/pdf'));
    expect(screen.getByText('to-remove.pdf')).toBeInTheDocument();

    const removeBtn = screen.getByLabelText('Remove file');
    await user.click(removeBtn);

    expect(screen.queryByText('to-remove.pdf')).not.toBeInTheDocument();
  });
});

// ============================================================
// INTEGRATION: full form flow
// ============================================================
describe('InvoiceCreation — Integration: form submission', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('navigates to /invoice-success after valid form submission', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    render(<InvoiceCreation />);

    fireEvent.change(screen.getByPlaceholderText('e.g., 50000'), {
      target: { name: 'amountNeeded', value: '5000' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g., 5000'), {
      target: { name: 'profitAmount', value: '500' },
    });
    fireEvent.change(document.querySelector('input[name="dueDate"]'), {
      target: { name: 'dueDate', value: futureDateString(5) },
    });
    fireEvent.change(document.querySelector('input[name="repaymentDay"]'), {
      target: { name: 'repaymentDay', value: futureDateString(10) },
    });

    uploadValidPdf();
    await user.click(screen.getByRole('checkbox'));

    const submitBtn = screen.getByRole('button', { name: /create invoice/i });
    await user.click(submitBtn);

    // Advance past the 1500ms simulated API delay
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/invoice-success');
      },
      { timeout: 5000 }
    );
  });

  it('shows all validation errors when form submitted empty', () => {
    render(<InvoiceCreation />);

    fireEvent.submit(document.querySelector('form'));

    expect(screen.getByText('Amount needed is required')).toBeInTheDocument();
    expect(screen.getByText('Profit amount is required')).toBeInTheDocument();
    expect(screen.getByText('Due date is required')).toBeInTheDocument();
    expect(screen.getByText('Repayment day is required')).toBeInTheDocument();
    expect(screen.getByText('At least one document is required')).toBeInTheDocument();
    expect(screen.getByText('You must agree to the terms')).toBeInTheDocument();
  });
});

// ============================================================
// INTEGRATION: input text visibility and button state
// ============================================================
describe('InvoiceCreation — Integration: input text is visible', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('typed text in amountNeeded is stored as input value', () => {
    render(<InvoiceCreation />);

    const amountInput = screen.getByPlaceholderText('e.g., 50000');
    fireEvent.change(amountInput, {
      target: { name: 'amountNeeded', value: '3000' },
    });
    expect(amountInput.value).toBe('3000');
  });

  it('typed text in profitAmount is stored as input value', () => {
    render(<InvoiceCreation />);

    const profitInput = screen.getByPlaceholderText('e.g., 5000');
    fireEvent.change(profitInput, {
      target: { name: 'profitAmount', value: '300' },
    });
    expect(profitInput.value).toBe('300');
  });

  it('comment textarea stores typed text', async () => {
    const user = userEvent.setup();
    render(<InvoiceCreation />);

    const commentArea = screen.getByPlaceholderText(/add any additional notes/i);
    await user.type(commentArea, 'Test comment');
    expect(commentArea.value).toBe('Test comment');
  });

  it('clears amountNeeded error when user starts typing in that field', () => {
    render(<InvoiceCreation />);

    fireEvent.submit(document.querySelector('form'));
    expect(screen.getByText('Amount needed is required')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('e.g., 50000'), {
      target: { name: 'amountNeeded', value: '100' },
    });

    expect(screen.queryByText('Amount needed is required')).not.toBeInTheDocument();
  });

  it('submit button is disabled when no file and terms not checked', () => {
    render(<InvoiceCreation />);
    expect(
      screen.getByRole('button', { name: /create invoice/i })
    ).toBeDisabled();
  });

  it('submit button is disabled when terms checked but no file', async () => {
    const user = userEvent.setup();
    render(<InvoiceCreation />);

    await user.click(screen.getByRole('checkbox'));

    expect(
      screen.getByRole('button', { name: /create invoice/i })
    ).toBeDisabled();
  });

  it('submit button is enabled when terms checked AND file uploaded', async () => {
    const user = userEvent.setup();
    render(<InvoiceCreation />);

    uploadValidPdf();
    await user.click(screen.getByRole('checkbox'));

    expect(
      screen.getByRole('button', { name: /create invoice/i })
    ).not.toBeDisabled();
  });
});

// ============================================================
// Tooltip
// ============================================================
describe('InvoiceCreation — Tooltip', () => {
  it('shows tooltip when help icon button is clicked', async () => {
    const user = userEvent.setup();
    render(<InvoiceCreation />);

    const helpBtn = screen.getByLabelText(/Help: Information about required documents/i);
    await user.click(helpBtn);

    expect(screen.getByText(/Це документ/i)).toBeInTheDocument();
  });

  it('hides tooltip when background overlay is clicked', async () => {
    const user = userEvent.setup();
    render(<InvoiceCreation />);

    const helpBtn = screen.getByLabelText(/Help: Information about required documents/i);
    await user.click(helpBtn);
    expect(screen.getByText(/Це документ/i)).toBeInTheDocument();

    const overlay = document.querySelector('.fixed.inset-0.z-40');
    fireEvent.click(overlay);
    expect(screen.queryByText(/Це документ/i)).not.toBeInTheDocument();
  });
});

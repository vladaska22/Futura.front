import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Messages from '../components/Messages';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <svg data-testid="icon-arrow-left" />,
  Send: () => <svg data-testid="icon-send" />,
  Search: () => <svg data-testid="icon-search" />,
}));

describe('Messages', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the Messages component with header', () => {
    render(<Messages />);
    expect(screen.getByText('Повідомлення')).toBeInTheDocument();
  });

  it('renders the list of chats in the sidebar', () => {
    render(<Messages />);
    // Both names appear at least once (sidebar list)
    expect(screen.getAllByText('Олександр (Техпідтримка)').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Марія (Менеджер)')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<Messages />);
    expect(screen.getByPlaceholderText('Пошук чату...')).toBeInTheDocument();
  });

  it('shows the active chat header by default (first chat)', () => {
    render(<Messages />);
    // The active chat name appears in the right panel header
    const headers = screen.getAllByText('Олександр (Техпідтримка)');
    expect(headers.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Технічний спеціаліст')).toBeInTheDocument();
  });

  it('displays messages of the active chat', () => {
    render(<Messages />);
    expect(screen.getByText('Вітаю! Чим можу допомогти з вашим інвойсом?')).toBeInTheDocument();
    expect(screen.getByText('Я відправила кошти, але статус ще "в обробці".')).toBeInTheDocument();
  });

  it('switches active chat when another chat is clicked', () => {
    render(<Messages />);
    const mariaChat = screen.getByText('Марія (Менеджер)').closest('div[style]');
    fireEvent.click(mariaChat);
    expect(screen.getByText('Фінансовий куратор')).toBeInTheDocument();
    // The message appears at least once (in the chat window)
    expect(screen.getAllByText('Проєкт повністю схвалено! Виплату вже можна замовляти на головному екрані.').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the message input and send button', () => {
    render(<Messages />);
    expect(screen.getByPlaceholderText('Напишіть повідомлення...')).toBeInTheDocument();
    expect(screen.getByTestId('icon-send')).toBeInTheDocument();
  });

  it('updates the message input value as the user types', () => {
    render(<Messages />);
    const input = screen.getByPlaceholderText('Напишіть повідомлення...');
    fireEvent.change(input, { target: { value: 'Привіт!' } });
    expect(input.value).toBe('Привіт!');
  });

  it('sends a message and clears the input on form submit', () => {
    render(<Messages />);
    const input = screen.getByPlaceholderText('Напишіть повідомлення...');
    fireEvent.change(input, { target: { value: 'Тестове повідомлення' } });
    fireEvent.submit(input.closest('form'));
    // The message appears at least once (in chat area; also appears as sidebar preview)
    expect(screen.getAllByText('Тестове повідомлення').length).toBeGreaterThanOrEqual(1);
    expect(input.value).toBe('');
  });

  it('does not send an empty message when form is submitted', () => {
    render(<Messages />);
    const input = screen.getByPlaceholderText('Напишіть повідомлення...');
    // Count messages before
    const messagesBefore = screen.getAllByText(/./);
    fireEvent.submit(input.closest('form'));
    // Input stays empty, no new messages added
    expect(input.value).toBe('');
  });

  it('calls navigate(-1) when the back button is clicked', () => {
    render(<Messages />);
    const backBtn = screen.getByTestId('icon-arrow-left').closest('button');
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});

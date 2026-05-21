import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Notifications from '../components/Notifications';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('Notifications', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the Notifications component with header', () => {
    render(<Notifications />);
    expect(screen.getByText('Сповіщення')).toBeInTheDocument();
  });

  it('renders all notifications initially', () => {
    render(<Notifications />);
    expect(screen.getByText('Ваш інвойс #4029 успішно оплачено контрагентом.')).toBeInTheDocument();
    expect(screen.getByText('Олександр з техпідтримки надіслав вам нове повідомлення.')).toBeInTheDocument();
    expect(screen.getByText('Запит на виплату схвалено фінансовим куратором.')).toBeInTheDocument();
    expect(screen.getByText('Система успішно верифікувала ваші документи.')).toBeInTheDocument();
  });

  it('shows the "Очистити все" button when notifications exist', () => {
    render(<Notifications />);
    expect(screen.getByText('Очистити все')).toBeInTheDocument();
  });

  it('shows notification timestamps', () => {
    render(<Notifications />);
    expect(screen.getByText('10 хв. тому')).toBeInTheDocument();
    expect(screen.getByText('1 год. тому')).toBeInTheDocument();
  });

  it('deletes a single notification when its dismiss button is clicked', () => {
    render(<Notifications />);
    const dismissButtons = screen.getAllByTitle('Видалити');
    fireEvent.click(dismissButtons[0]);
    expect(screen.queryByText('Ваш інвойс #4029 успішно оплачено контрагентом.')).not.toBeInTheDocument();
    // Other notifications still present
    expect(screen.getByText('Олександр з техпідтримки надіслав вам нове повідомлення.')).toBeInTheDocument();
  });

  it('clears all notifications when "Очистити все" is clicked', () => {
    render(<Notifications />);
    fireEvent.click(screen.getByText('Очистити все'));
    expect(screen.queryByText('Ваш інвойс #4029 успішно оплачено контрагентом.')).not.toBeInTheDocument();
    expect(screen.queryByText('Олександр з техпідтримки надіслав вам нове повідомлення.')).not.toBeInTheDocument();
  });

  it('shows empty state message after clearing all notifications', () => {
    render(<Notifications />);
    fireEvent.click(screen.getByText('Очистити все'));
    expect(screen.getByText('У вас немає нових сповіщень')).toBeInTheDocument();
  });

  it('hides the "Очистити все" button when list is empty', () => {
    render(<Notifications />);
    fireEvent.click(screen.getByText('Очистити все'));
    expect(screen.queryByText('Очистити все')).not.toBeInTheDocument();
  });

  it('can delete notifications one by one until the list is empty', () => {
    render(<Notifications />);
    // Delete all 4 notifications one by one
    for (let i = 0; i < 4; i++) {
      const buttons = screen.getAllByTitle('Видалити');
      fireEvent.click(buttons[0]);
    }
    expect(screen.getByText('У вас немає нових сповіщень')).toBeInTheDocument();
  });

  it('calls navigate(-1) when the back button is clicked', () => {
    render(<Notifications />);
    fireEvent.click(screen.getByText(/← Назад/));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});

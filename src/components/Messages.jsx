import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Search } from 'lucide-react';

const Messages = () => {
  const navigate = useNavigate();

  // 1. Створюємо список чатів та повідомлень у пам'яті програми
  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Олександр (Техпідтримка)',
      role: 'Технічний спеціаліст',
      avatarColor: '#06b6d4',
      messages: [
        { id: 1, text: 'Вітаю! Чим можу допомогти з вашим інвойсом?', sender: 'them', time: '14:20' },
        { id: 2, text: 'Я відправила кошти, але статус ще "в обробці".', sender: 'me', time: '14:22' },
        { id: 3, text: 'Не хвилюйтеся, транзакція триває до 5 хвилин. Зараз усе перевірю!', sender: 'them', time: '14:23' },
      ]
    },
    {
      id: 2,
      name: 'Марія (Менеджер)',
      role: 'Фінансовий куратор',
      avatarColor: '#eab308',
      messages: [
        { id: 1, text: 'Проєкт повністю схвалено! Виплату вже можна замовляти на головному екрані.', sender: 'them', time: 'Вчора' }
      ]
    }
  ]);

  // 2. Стейт для збереження ID активного чату та тексту в інпуті
  const [activeChatId, setActiveChatId] = useState(1);
  const [messageText, setMessageText] = useState('');

  // Знаходимо, який чат зараз відкритий
  const activeChat = chats.find(c => c.id === activeChatId);

  // 3. Функція для відправки повідомлення
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return; // Якщо текст порожній — нічого не робити

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'me',
      time: currentTime
    };

    // Оновлюємо масив чатів
    setChats(chats.map(chat => {
      if (chat.id === activeChatId) {
        return { ...chat, messages: [...chat.messages, newMessage] };
      }
      return chat;
    }));

    setMessageText(''); // Очищаємо поле вводу
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#1a0633', color: 'white', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* Верхня панель (Header) */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 40px', backgroundColor: '#240b45', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '22px', margin: 0, fontWeight: 'bold' }}>Повідомлення</h1>
      </header>

      {/* Головна робоча зона чату */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* ЛІВА ЧАСТИНА: Список діалогів */}
        <div style={{ width: '320px', backgroundColor: '#240b45', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          {/* Пошук */}
          <div style={{ padding: '20px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '32px', top: '31px', color: 'rgba(255,255,255,0.4)' }} />
            <input type="text" placeholder="Пошук чату..." style={{ width: '100%', backgroundColor: '#1a0633', border: 'none', borderRadius: '12px', padding: '12px 12px 12px 40px', color: 'white', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
          </div>

          {/* Самі чати */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
            {chats.map(chat => (
              <div 
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '16px', cursor: 'pointer', marginBottom: '8px',
                  backgroundColor: activeChatId === chat.id ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                  border: activeChatId === chat.id ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid transparent',
                  transition: '0.2s'
                }}
              >
                {/* Аватарка-заглушка */}
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: chat.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                  {chat.name[0]}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.name}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {chat.messages[chat.messages.length - 1]?.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ПРАВА ЧАСТИНА: Відкрите вікно чату */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#1a0633' }}>
          
          {/* Шапка активного чату */}
          <div style={{ padding: '15px 30px', backgroundColor: 'rgba(36, 11, 69, 0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{activeChat.name}</h2>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{activeChat.role}</span>
          </div>

          {/* Повідомлення */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {activeChat.messages.map(msg => {
              const isMe = msg.sender === 'me';
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%', alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    padding: '12px 18px', borderRadius: '20px', fontSize: '15px', lineHeight: '1.4',
                    backgroundColor: isMe ? '#a855f7' : '#240b45',
                    color: 'white',
                    borderBottomRightRadius: isMe ? '4px' : '20px',
                    borderBottomLeftRadius: isMe ? '20px' : '4px',
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '5px', padding: '0 5px' }}>{msg.time}</span>
                </div>
              );
            })}
          </div>

          {/* Форма відправки повідомлення */}
          <form onSubmit={handleSendMessage} style={{ padding: '20px 30px', backgroundColor: '#240b45', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input 
              type="text" 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Напишіть повідомлення..." 
              style={{ flex: 1, backgroundColor: '#1a0633', border: 'none', borderRadius: '14px', padding: '14px 20px', color: 'white', fontSize: '15px', outline: 'none' }}
            />
            <button type="submit" style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#a855f7', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}>
              <Send size={20} />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

export default Messages;
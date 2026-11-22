class Registration {
  constructor(fields) {
    this.name = fields.get('name').trim();
    this.email = fields.get('email').trim();
    this.meeting = fields.get('meeting');
    this.accepted = fields.has('accepted');
  }

  printSummary() {
    console.table({
      'Имя': this.name,
      'Почта': this.email,
      'Встреча': this.meeting,
      'Правила приняты': this.accepted
    });
  }
}

const form = document.querySelector('.registration');
const statusMessage = form.querySelector('[role="status"]');
const button = form.querySelector('button');

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (button.disabled) return;
  const registration = new Registration(new FormData(form));
  registration.printSummary();
  button.disabled = true;
  statusMessage.textContent = 'Отправляем заявку…';
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registration)
    });
    const result = await response.json();
    statusMessage.textContent = result.message;
    if (response.ok) form.reset();
  } catch {
    statusMessage.textContent = 'Сервер недоступен. Повторите отправку.';
  } finally {
    button.disabled = false;
  }
});

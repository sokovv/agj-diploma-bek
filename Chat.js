module.exports = class Chat {
  constructor() {
    this.chats = [];
  }

  allChatList() {
    const chatList = this.chats.map(({
      id,
      event,
      message,
      date,
    }) => ({
      id,
      event,
      message,
      date,
    }));
    return chatList
  }

  addChat(event, message, date) {
    let endId = 0;
    this.chats.map((item) => {
      if (item.id > endId)
        endId = item.id;
    });
    this.chats.push({
      id: endId + 1,
      event,
      message,
      date,
    }, );
  }

  command(message) {
    if (message === '@weather') {
      let weather = ['Гроза⚡', 'Дождь☔', 'Град🌨', 'Снег❄', 'Ветер🌬', 'Ураган🌪', 'Метель🌫', 'Жара🔥', 'Пора на пляж⛱', 'Дубак -50☃', 'Солнечно🌞'];
      let item = weather[Math.floor(Math.random() * weather.length)];
      return `Погодка за окном: ${item}`
    }

    if (message === '@poem') {
      let poem = ['Белеет парус одинокой В тумане моря голубом!..',
        'Подруга дней моих суровых,Голубка дряхлая моя!',
        'И скучно и грустно, и некому руку подать В минуту душевной невзгоды…',
        'Вы так вели по бездорожью, Как в мрак падучая звезда.',
        'Зайку бросила хозяйка — Под дождем остался зайка.',
        'Где обедал, воробей? В зоопарке у зверей.',
        'Спать пора! Уснул бычок, Лег в коробку на бочок.',
        'Наша Таня громко плачет: Уронила в речку мячик.Жара🔥',
        'Пора на пляж⛱',
        'Пора вставать... Ресниц не вскинуть сонных.Пора вставать...Будильник сам не свой. В окно глядит и сетует подсолнух,покачивая рыжей головой.',
        'Юные, светлые братья Силы, восторга, мечты, Вам раскрываю объятья, Сын голубой высоты.'
      ];
      let item = poem[Math.floor(Math.random() * poem.length)];
      return `Стих от бота: ${item}`
    }

    if (message === '@time') {
      const dateFormat = new Date();
      const timeOptions = {
        minute: '2-digit',
        hour: '2-digit',
      };
      return `Полагаю ты отключил уведомления раз спрашиваешь время, вот тебе время: ${dateFormat.toLocaleString('ru-RU', timeOptions)}`
    }
  }
}
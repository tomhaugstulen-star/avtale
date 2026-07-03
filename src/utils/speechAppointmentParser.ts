const hourWords: Record<string, number> = {
  ett: 1, en: 1, to: 2, tre: 3, fire: 4, fem: 5, seks: 6,
  sju: 7, syv: 7, åtte: 8, ni: 9, ti: 10, elleve: 11, tolv: 12,
  tretten: 13, fjorten: 14, femten: 15, seksten: 16, sytten: 17,
  atten: 18, nitten: 19, tjue: 20, tjueen: 21, tjueto: 22, tjuetre: 23,
};

type ParsedSpeech = {
  title: string;
  time?: Date;
};

function toHour(value: string) {
  const normalized = value.toLowerCase().replace(/\s+/g, '');
  const numeric = Number(normalized.replace(',', '.'));
  if (Number.isInteger(numeric) && numeric >= 0 && numeric <= 23) return numeric;
  return hourWords[normalized];
}

function buildTime(base: Date, hour: number, minute: number) {
  const value = new Date(base);
  value.setHours(hour, minute, 0, 0);
  return value;
}

function cleanTitle(text: string, start: number, length: number) {
  const before = text.slice(0, start);
  const after = text.slice(start + length);
  const cleaned = `${before} ${after}`
    .replace(/\s+/g, ' ')
    .replace(/^[,.:;\-\s]+|[,.:;\-\s]+$/g, '')
    .trim();
  return cleaned || text.trim();
}

export function parseSpokenAppointment(text: string, baseTime: Date): ParsedSpeech {
  const patterns: Array<{
    regex: RegExp;
    resolve: (match: RegExpMatchArray) => { hour: number; minute: number } | undefined;
  }> = [
    {
      regex: /\b(?:klokka|klokken|kl\.?)[ ]*(\d{1,2})(?::|\.|,| )[ ]*(\d{2})\b/i,
      resolve: (match) => {
        const hour = Number(match[1]);
        const minute = Number(match[2]);
        return hour <= 23 && minute <= 59 ? { hour, minute } : undefined;
      },
    },
    {
      regex: /\b(?:klokka|klokken|kl\.?)[ ]*(\d{1,2})\b/i,
      resolve: (match) => {
        const hour = Number(match[1]);
        return hour <= 23 ? { hour, minute: 0 } : undefined;
      },
    },
    {
      regex: /\b(?:klokka|klokken|kl\.?)[ ]*halv[ ]+(\p{L}+)\b/iu,
      resolve: (match) => {
        const nextHour = toHour(match[1]);
        return nextHour === undefined ? undefined : { hour: (nextHour + 23) % 24, minute: 30 };
      },
    },
    {
      regex: /\b(?:klokka|klokken|kl\.?)[ ]*kvart[ ]+over[ ]+(\p{L}+)\b/iu,
      resolve: (match) => {
        const hour = toHour(match[1]);
        return hour === undefined ? undefined : { hour, minute: 15 };
      },
    },
    {
      regex: /\b(?:klokka|klokken|kl\.?)[ ]*kvart[ ]+på[ ]+(\p{L}+)\b/iu,
      resolve: (match) => {
        const nextHour = toHour(match[1]);
        return nextHour === undefined ? undefined : { hour: (nextHour + 23) % 24, minute: 45 };
      },
    },
    {
      regex: /\b(?:klokka|klokken|kl\.?)[ ]*(fem|ti|tjue)[ ]+(over|på)[ ]+(\p{L}+)\b/iu,
      resolve: (match) => {
        const amount = toHour(match[1]);
        const hour = toHour(match[3]);
        if (amount === undefined || hour === undefined) return undefined;
        return match[2].toLowerCase() === 'over'
          ? { hour, minute: amount }
          : { hour: (hour + 23) % 24, minute: 60 - amount };
      },
    },
    {
      regex: /\b(?:klokka|klokken|kl\.?)[ ]*(\p{L}+)\b/iu,
      resolve: (match) => {
        const hour = toHour(match[1]);
        return hour === undefined ? undefined : { hour, minute: 0 };
      },
    },
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern.regex);
    if (!match || match.index === undefined) continue;
    const resolved = pattern.resolve(match);
    if (!resolved) continue;
    return {
      title: cleanTitle(text, match.index, match[0].length),
      time: buildTime(baseTime, resolved.hour, resolved.minute),
    };
  }

  return { title: text.trim() };
}

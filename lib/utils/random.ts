// Define the alphabet for random string generation
const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const random = (min: number, max: number): number => {
  return min + Math.floor(Math.random() * (max - min) + 1);
};

// randomInt generates a random integer between min and max.
export function randomInt(min: number, max: number): number {
  return random(min, max);
}

// randomString generates a random string of length n.
export function randomString(n: number): string {
  let result = "";
  for(let i = 0; i < n; i++) {
    const randomIndex = random(0, alphabets.length - 1);
    result += alphabets.charAt(randomIndex);
  }
  return result;
}

// randomBusiness generates a random business name.
export function randomBusiness(): string {
  return randomString(10);
}

// randomEmail generates a random email.
export function randomEmail(): string {
  return `${randomString(6)}-${randomString(6)}@gmail.com`;
}

// randomProfileImgUrl generates a random image url.
export function randomProfileImgUrl(): string {
  return `https://${randomString(15)}.png`;
}

// Compare current time against time
export function afterTime(time: Date) {
  return new Date() > time;
}
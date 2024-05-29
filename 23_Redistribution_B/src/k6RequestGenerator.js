import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomItem, randomString } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';

export let options = {
  vus: 2000, 
  duration: '5s', 
};

const validShops = ['shop1', 'shop2', 'shop3', 'shop4', 'shop5'];
const invalidShop = 'invalidShop';

function generateUserName() {
  return `user_${randomString(10)}`;
}

export default function () {
  let url = 'https://09jp1jlpw1.execute-api.eu-north-1.amazonaws.com/prod/markets';

  let shopId = Math.random() > 0.8 ? invalidShop : randomItem(validShops);
  let payload = JSON.stringify({
    name: generateUserName(),
    password: 'password', 
    search_phrase: randomString(10), 
    shop_id: shopId,
  });

  let params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post(url, payload, params);
  check(res, {
    'is status 200': (r) => r.status === 200,
    'is status 400': (r) => r.status === 400,
  });
  sleep(1); // Adjust sleep time based on desired request rate
}

import { MongoClient } from 'mongodb';
import { product_list } from './data.js';

const uri = 'mongodb+srv://michieda4747:jCGqch1gokJO7yae@travel.28hubvd.mongodb.net/';
const dbName = 'florum';

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('product_list');

    // 可选：先清空原有数据
    await collection.deleteMany({});

    // 批量插入
    const result = await collection.insertMany(product_list);
    console.log('插入成功，数量:', result.insertedCount);
  } catch (err) {
    console.error('插入失败:', err);
  } finally {
    await client.close();
  }
}

main();
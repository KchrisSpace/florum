import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const port = 3000;

// MongoDB连接配置
const uri =
  'mongodb+srv://michieda4747:jCGqch1gokJO7yae@travel.28hubvd.mongodb.net/';
const dbName = 'florum';

// 创建MongoDB客户端
const client = new MongoClient(uri);

// 连接MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    console.log('成功连接到MongoDB Atlas');
    const db = client.db(dbName);
  } catch (err) {
    console.error('MongoDB连接错误:', err);
  }
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// 设置文件存储路径和文件名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/avatars');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, `${req.params.user_id}_${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  },
});

// 获取用户列表
app.get('/users', async (req, res) => {
  try {
    const { username, email, status } = req.query;
    const db = client.db(dbName);
    let query = {};

    if (username) {
      query.username = { $regex: username, $options: 'i' };
    }
    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }

    const users = await db.collection('users').find(query).toArray();
    res.json({
      code: 200,
      message: 'success',
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 获取单个用户
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db(dbName);
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户未找到',
        data: null,
      });
    }

    res.json({
      code: 200,
      message: 'success',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 更新用户
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const db = client.db(dbName);

    const result = await db
      .collection('users')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

    if (!result.value) {
      return res.status(404).json({
        code: 404,
        message: '用户未找到',
        data: null,
      });
    }

    res.json({
      code: 200,
      message: '更新成功',
      data: result.value,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 删除用户
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db(dbName);

    const result = await db
      .collection('users')
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!result.value) {
      return res.status(404).json({
        code: 404,
        message: '用户未找到',
        data: null,
      });
    }

    res.json({
      code: 200,
      message: '删除成功',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 获取角色列表
app.get('/roles', async (req, res) => {
  try {
    const db = client.db(dbName);
    const roles = await db.collection('roles').find().toArray();
    res.json({
      code: 200,
      message: 'success',
      data: roles,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 获取用户操作日志
app.get('/users/:id/logs', async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db(dbName);
    const logs = await db
      .collection('userLogs')
      .find({ user_id: id })
      .toArray();
    res.json({
      code: 200,
      message: 'success',
      data: logs,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 获取登录数据
app.get('/login', async (req, res) => {
  try {
    const db = client.db(dbName);
    const loginData = await db.collection('login').find().toArray();
    res.json(loginData);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 获取商品列表
app.get('/product_list', async (req, res) => {
  try {
    const db = client.db(dbName);
    const products = await db.collection('product_list').find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 获取商品详情
app.get('/product_list/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db(dbName);
    const product = await db.collection('product_list').findOne({ id });

    if (!product) {
      return res.status(404).json({ error: '商品未找到' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 购物车相关接口
app.get('/cart', async (req, res) => {
  try {
    const db = client.db(dbName);
    const cartItems = await db.collection('cart').find().toArray();
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.post('/cart', async (req, res) => {
  try {
    const newItem = req.body;
    const db = client.db(dbName);
    await db.collection('cart').insertOne(newItem);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.put('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = req.body;
    const db = client.db(dbName);

    const result = await db
      .collection('cart')
      .findOneAndUpdate(
        { id },
        { $set: updatedItem },
        { returnDocument: 'after' }
      );

    if (!result.value) {
      return res.status(404).send('Item not found');
    }

    res.json(result.value);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.delete('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db(dbName);

    if (id === 'clear') {
      await db.collection('cart').deleteMany({});
      res.json({ message: '购物车已清空' });
    } else {
      const result = await db.collection('cart').findOneAndDelete({ id });
      if (!result.value) {
        return res.status(404).send('Item not found');
      }
      res.json(result.value);
    }
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 心愿单相关接口
app.get('/wishlist', async (req, res) => {
  try {
    const db = client.db(dbName);
    const wishlistItems = await db.collection('wishlist').find().toArray();
    res.json(wishlistItems);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.post('/wishlist', async (req, res) => {
  try {
    const newItem = req.body;
    const db = client.db(dbName);
    await db.collection('wishlist').insertOne(newItem);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.put('/wishlist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = req.body;
    const db = client.db(dbName);

    const result = await db
      .collection('wishlist')
      .findOneAndUpdate(
        { id },
        { $set: updatedItem },
        { returnDocument: 'after' }
      );

    if (!result.value) {
      return res.status(404).send('Item not found');
    }

    res.json(result.value);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.delete('/wishlist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db(dbName);

    const result = await db.collection('wishlist').findOneAndDelete({ id });
    if (!result.value) {
      return res.status(404).send('Item not found');
    }
    res.json(result.value);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 文章相关接口
app.get('/articles', async (req, res) => {
  try {
    const db = client.db(dbName);
    const articles = await db.collection('articles').find().toArray();
    res.json(articles);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 文章评论相关接口
app.get('/article_comments', async (req, res) => {
  try {
    const { article_id } = req.query;
    if (!article_id) {
      return res.status(400).json({ error: '缺少 articleId 参数' });
    }

    const db = client.db(dbName);
    const comments = await db
      .collection('article_comments')
      .find({ article_id })
      .toArray();
    res.json(comments);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.post('/article_comments', async (req, res) => {
  try {
    const newComment = req.body;
    const db = client.db(dbName);
    await db.collection('article_comments').insertOne(newComment);
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 商品评论相关接口
app.get('/product_comments', async (req, res) => {
  try {
    const { product_id } = req.query;
    if (!product_id) {
      return res.status(400).json({ error: '缺少 productId 参数' });
    }

    const db = client.db(dbName);
    const comments = await db
      .collection('product_comments')
      .find({ product_id })
      .toArray();
    res.json(comments);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.post('/product_comments', async (req, res) => {
  try {
    const newComment = req.body;
    const db = client.db(dbName);
    await db.collection('product_comments').insertOne(newComment);
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 反馈相关接口
app.get('/feedback', async (req, res) => {
  try {
    const db = client.db(dbName);
    const feedbacks = await db.collection('feedback').find().toArray();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.post('/feedback', async (req, res) => {
  try {
    const newItem = req.body;
    const db = client.db(dbName);
    await db.collection('feedback').insertOne(newItem);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 用户更新相关接口
app.put(
  '/user_update/:user_id',
  upload.single('user_avatar'),
  async (req, res) => {
    try {
      const { user_id } = req.params;
      const updateData = req.body;
      const db = client.db(dbName);

      if (req.file) {
        updateData.user_avatar = `/uploads/avatars/${req.file.filename}`;
      }

      const result = await db
        .collection('user_update')
        .findOneAndUpdate(
          { user_id },
          { $set: updateData },
          { returnDocument: 'after' }
        );

      if (!result.value) {
        return res.status(404).json({ error: '用户未找到' });
      }

      res.json(result.value);
    } catch (err) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: err.message,
      });
    }
  }
);

app.get('/user_update/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const db = client.db(dbName);
    const user = await db.collection('user_update').findOne({ user_id });

    if (!user) {
      return res.status(404).json({ error: '用户未找到' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 地址相关接口
app.get('/addresses', async (req, res) => {
  try {
    const { user_id } = req.query;
    const db = client.db(dbName);
    let query = {};

    if (user_id) {
      query.user_id = user_id;
    }

    const addresses = await db.collection('addresses').find(query).toArray();
    res.json(addresses);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.post('/addresses', async (req, res) => {
  try {
    const newAddress = req.body;
    const db = client.db(dbName);

    if (newAddress.is_default) {
      await db
        .collection('addresses')
        .updateMany(
          { user_id: newAddress.user_id },
          { $set: { is_default: false } }
        );
    }

    const result = await db.collection('addresses').insertOne(newAddress);
    newAddress._id = result.insertedId;
    res.status(201).json(newAddress);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.put('/addresses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const db = client.db(dbName);

    if (updateData.is_default) {
      await db
        .collection('addresses')
        .updateMany(
          { user_id: updateData.user_id },
          { $set: { is_default: false } }
        );
    }

    const result = await db
      .collection('addresses')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

    if (!result.value) {
      return res.status(404).json({ error: '地址未找到' });
    }

    res.json(result.value);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.delete('/addresses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db(dbName);

    const result = await db
      .collection('addresses')
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!result.value) {
      return res.status(404).json({ error: '地址未找到' });
    }

    res.json(result.value);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 订单相关接口
app.get('/normal_orders', async (req, res) => {
  try {
    const { user_id } = req.query;
    const db = client.db(dbName);
    let query = {};

    if (user_id) {
      query.user_id = user_id;
    }

    const orders = await db.collection('normal_orders').find(query).toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.post('/normal_orders', async (req, res) => {
  try {
    const newOrder = req.body;
    const db = client.db(dbName);

    if (
      !newOrder.user_id ||
      !newOrder.items ||
      !Array.isArray(newOrder.items)
    ) {
      return res.status(400).json({ error: '缺少必要字段' });
    }

    newOrder.created_at = new Date().toISOString();
    await db.collection('normal_orders').insertOne(newOrder);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.put('/normal_orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = client.db(dbName);

    const result = await db
      .collection('normal_orders')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status } },
        { returnDocument: 'after' }
      );

    if (!result.value) {
      return res.status(404).json({ error: '订单未找到' });
    }

    res.json(result.value);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.delete('/normal_orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db(dbName);

    const result = await db
      .collection('normal_orders')
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!result.value) {
      return res.status(404).json({ error: '订单未找到' });
    }

    res.json(result.value);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 定制相关接口
app.get('/custom', async (req, res) => {
  try {
    const { user_id } = req.query;
    const db = client.db(dbName);
    let query = {};

    if (user_id) {
      query.user_id = user_id;
    }

    const customs = await db.collection('custom').find(query).toArray();
    res.json(customs);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.post('/custom', async (req, res) => {
  try {
    const newCustom = req.body;
    const db = client.db(dbName);
    await db.collection('custom').insertOne(newCustom);
    res.status(201).json(newCustom);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 轮播图相关接口
app.get('/carousel', async (req, res) => {
  try {
    const db = client.db(dbName);
    const carousels = await db.collection('carousel').find().toArray();
    res.json(carousels);
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

app.use('/uploads', express.static('public/uploads'));

// 启动服务器
connectToMongo().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

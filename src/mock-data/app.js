import express from 'express';
import cors from 'cors';
import multer from 'multer';
import {
  login,
  user_update,
  product_list,
  cart,
  product_comments,
  article_comments,
  articles,
  addresses,
  custom,
  normal_orders,
  feedback,
  carousel,
} from './data.js';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

const app = express();
const port = 3000;

// 设置文件存储路径和文件名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/avatars'); // 头像存放目录（需确保存在）
  },
  filename: function (req, file, cb) {
    // 用用户ID+时间戳+原始扩展名命名
    const ext = file.originalname.split('.').pop();
    cb(null, `${req.params.user_id}_${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage });

// 获取所有用户（注册页用）
app.get('/users', (req, res) => {
  res.json(login);
  console.log('所有用户', login);
});

// 获取登录数据（登录页用）
app.get('/login', (req, res) => {
  res.json(login);
  console.log('登录数据', login);
});

// 获取商品列表
app.get('/product_list', (req, res) => {
  console.log('商品列表', product_list);
  res.json(product_list);
});

// GET /cart - 获取购物车中的所有商品
app.get('/cart', (req, res) => {
  console.log('cart详情', cart);
  res.json(cart);
});

// POST /cart - 向购物车中添加商品
app.post('/cart', (req, res) => {
  const newItem = req.body;
  cart.push(newItem);
  res.status(201).json(newItem);
  console.log('cart详情', cart);
});

// PUT /cart/:id - 更新购物车中指定商品的数量
app.put('/cart/:id', (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    cart[itemIndex] = { ...cart[itemIndex], ...updatedItem };
    res.json(cart[itemIndex]);
  } else {
    res.status(404).send('Item not found');
  }
  console.log('cart详情', cart);
});

// DELETE /cart/:id - 从购物车中删除指定商品
app.delete('/cart/:id', (req, res) => {
  const { id } = req.params;
  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    const deletedItem = cart.splice(itemIndex, 1);
    res.json(deletedItem);
  } else {
    res.status(404).send('Item not found');
  }
  console.log('cart详情', cart);
});
// 获取文章列表
app.get('/articles', (req, res) => {
  console.log('文章列表', articles);
  res.json(articles);
});

// 获取指定文章评论
app.get('/article_comments', (req, res) => {
  const { article_id } = req.query;
  if (!article_id) {
    return res.status(400).json({ error: '缺少 articleId 参数' });
  }
  // 过滤出对应文章的评论
  const comments = article_comments.filter((c) => c.article_id === article_id);
  res.json(comments);
  console.log('文章评论', comments);
});

// 获取商品评论
app.get('/product_comments', (req, res) => {
  const { productId } = req.query;
  if (!productId) {
    return res.status(400).json({ error: '缺少 productId 参数' });
  }
  const comments = product_comments.filter((c) => c.productId === productId);
  res.json(comments);
});

// 添加文章评论
app.post('/article_comments', (req, res) => {
  const newComment = req.body;
  article_comments.unshift(newComment); // 新评论放最前面
  res.status(201).json(newComment);
  console.log('添加文章评论后', article_comments);
});

// 添加商品评论
app.post('/product_comments', (req, res) => {
  const newComment = req.body;
  res.status(201).json(newComment);
});

// 获取反馈信息
app.get('/feedback', (req, res) => {
  console.log('反馈信息', feedback);
  res.json(feedback);
});
// 添加反馈信息
app.post('/feedback', (req, res) => {
  const newItem = req.body;
  feedback.push(newItem);
  console.log('反馈信息', feedback);
  res.status(201).json(newItem);
});


// PUT /user_update/:user_id - 更新用户信息（支持头像上传）
app.put('/user_update/:user_id', upload.single('user_avatar'), (req, res) => {
  const { user_id } = req.params;
  const updateData = req.body;

  // 查找用户
  const userIndex = user_update.findIndex((u) => u.user_id === user_id);
  if (userIndex === -1) {
    return res.status(404).json({ error: '用户未找到' });
  }

  // 如果有文件上传，保存头像路径
  if (req.file) {
    // 你可以根据实际情况保存相对路径或绝对路径
    updateData.avatar = `/uploads/avatars/${req.file.filename}`;
  }

  // 更新用户信息
  user_update[userIndex] = { ...user_update[userIndex], ...updateData };

  res.json(user_update[userIndex]);
});

// 获取指定用户信息
app.get('/user_update/:user_id', (req, res) => {
  const { user_id } = req.params;
  const user = user_update.find((u) => u.user_id === user_id);
  if (!user) {
    return res.status(404).json({ error: '用户未找到' });
  }
  res.json(user);
});

app.use('/uploads', express.static('public/uploads'));

app.get('/addresses', (req, res) => {
  res.json(addresses);
});

app.post('/addresses', (req, res) => {
  const newAddress = req.body;
  // 简单生成唯一id
  newAddress.id = 'A' + (addresses.length + 1).toString().padStart(2, '0');
  // 如果是默认地址，先把其他地址的 is_default 设为 false
  if (newAddress.is_default) {
    addresses.forEach((addr) => (addr.is_default = false));
  }
  addresses.push(newAddress);
  res.status(201).json(newAddress);
});

app.put('/addresses/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const index = addresses.findIndex((addr) => addr.id === id);
  if (index === -1) {
    return res.status(404).json({ error: '地址未找到' });
  }
  // 如果要设置为默认地址，先把其他地址的 is_default 设为 false
  if (updateData.is_default) {
    addresses.forEach((addr) => (addr.is_default = false));
  }
  addresses[index] = { ...addresses[index], ...updateData };
  res.json(addresses[index]);
});

app.delete('/addresses/:id', (req, res) => {
  const { id } = req.params;
  const index = addresses.findIndex((addr) => addr.id === id);
  if (index === -1) {
    return res.status(404).json({ error: '地址未找到' });
  }
  const deleted = addresses.splice(index, 1);
  res.json(deleted[0]);
});

// 获取所有订单
app.get('/normal_orders', (req, res) => {
  const { user_id } = req.query;
  if (user_id) {
    return res.json(normal_orders.filter((order) => order.user_id === user_id));
  }
  res.json(normal_orders);
});

app.post('/normal_orders', (req, res) => {
  const newOrder = req.body;
  // 简单生成唯一id
  newOrder.id = 'O' + (normal_orders.length + 1).toString().padStart(2, '0');
  normal_orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.put('/normal_orders/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const index = normal_orders.findIndex((order) => order.id === id);
  if (index === -1) {
    return res.status(404).json({ error: '订单未找到' });
  }
  normal_orders[index] = { ...normal_orders[index], ...updateData };
  res.json(normal_orders[index]);
});

app.delete('/normal_orders/:id', (req, res) => {
  const { id } = req.params;
  const index = normal_orders.findIndex((order) => order.id === id);
  if (index === -1) {
    return res.status(404).json({ error: '订单未找到' });
  }
  const deleted = normal_orders.splice(index, 1);
  res.json(deleted[0]);
});

// 根据用户id获取定制信息
app.get('/custom', (req, res) => {
  const { user_id } = req.query;
  if (user_id) {
    return res.json(custom.filter((item) => item.user_id === user_id));
  }
  res.json(custom);
});
// 添加定制信息
app.post('/custom', (req, res) => {
  const newCustom = req.body;
  // 简单生成唯一id
  newCustom.id = 'C' + (custom.length + 1).toString().padStart(2, '0');
  custom.push(newCustom);
  // 打印添加后的定制信息
  console.log('添加定制信息后', custom);
  res.status(201).json(newCustom);
});

// 获取轮播图数据
app.get('/carousel', (req, res) => {
  res.json(carousel);
  console.log('轮播图数据', carousel);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

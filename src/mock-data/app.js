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
  wishlist,
} from './data.js';

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// 设置文件存储路径和文件名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/avatars'); // 头像存放目录
  },
  filename: function (req, file, cb) {
    // 用用户ID+时间戳+原始扩展名命名
    const ext = file.originalname.split('.').pop();
    cb(null, `${req.params.user_id}_${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 限制文件大小为2MB
  },
  fileFilter: (req, file, cb) => {
    // 只接受图片文件
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  },
});

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

// 获取商品详情
app.get('/product_list/:id', (req, res) => {
  const { id } = req.params;
  const product = product_list.find((item) => item.id === id);
  if (!product) {
    return res.status(404).json({ error: '商品未找到' });
  }
  res.json(product);
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
  if (id === 'clear') {
    // 清空整个购物车
    while (cart.length > 0) {
      cart.pop();
    }
    console.log('清空购物车后', cart);
    res.json({ message: '购物车已清空' });
  } else {
    // 删除指定商品
    const itemIndex = cart.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
      const deletedItem = cart.splice(itemIndex, 1);
      res.json(deletedItem);
    } else {
      res.status(404).send('Item not found');
    }
    console.log('cart详情', cart);
  }
});

// GET /wishlist - 获取心愿单中的所有商品
app.get('/wishlist', (req, res) => {
  console.log('wishlist详情', wishlist);
  res.json(wishlist);
});

// POST /wishlist - 向心愿单中添加商品
app.post('/wishlist', (req, res) => {
  const newItem = req.body;
  wishlist.push(newItem);
  res.status(201).json(newItem);
  console.log('wishlist详情', wishlist);
});

// PUT /wishlist/:id - 更新心愿单中指定商品的数量
app.put('/wishlist/:id', (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  const itemIndex = wishlist.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    wishlist[itemIndex] = { ...wishlist[itemIndex], ...updatedItem };
    res.json(wishlist[itemIndex]);
  } else {
    res.status(404).send('Item not found');
  }
  console.log('wishlist详情', wishlist);
});

// DELETE /wishlist/:id - 从心愿单中删除指定商品
app.delete('/wishlist/:id', (req, res) => {
  const { id } = req.params;
  const itemIndex = wishlist.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    const deletedItem = wishlist.splice(itemIndex, 1);
    res.json(deletedItem[0]);
  } else {
    res.status(404).send('Item not found');
  }
  console.log('wishlist详情', wishlist);
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
  const { product_id } = req.query;
  if (!product_id) {
    return res.status(400).json({ error: '缺少 productId 参数' });
  }
  const comments = product_comments.filter((c) => c.product_id === product_id);
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
    // 保存相对路径
    updateData.user_avatar = `/uploads/avatars/${req.file.filename}`;
  }

  // 更新用户信息
  user_update[userIndex] = { ...user_update[userIndex], ...updateData };
  console.log('更新用户信息', user_update[userIndex]);
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
  const { user_id } = req.query;
  if (user_id) {
    // 返回该用户的所有地址
    let add = addresses.filter((addr) => addr.user_id === user_id);
    console.log(add);
    return res.json(addresses.filter((addr) => addr.user_id === user_id));
  }
  // 不传 user_id 时返回全部地址
  res.json(addresses);
});

app.post('/addresses', (req, res) => {
  const newAddress = req.body;
  // 自动生成唯一id（简单做法，实际可用uuid等）
  newAddress.id = (
    addresses.length ? parseInt(addresses[addresses.length - 1].id) + 1 : 1
  ).toString();
  // 如果是默认地址，先把其他地址的 is_default 设为 false
  if (newAddress.is_default) {
    addresses.forEach((addr) => (addr.is_default = false));
  }
  addresses.push(newAddress);
  res.status(201).json(newAddress);
});

// 更新地址
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

// 获取所有订单或特定用户的订单
app.get('/normal_orders', (req, res) => {
  const { user_id } = req.query;

  if (user_id) {
    // 如果提供了user_id，则只返回该用户的订单
    const userOrders = normal_orders.filter(
      (order) => order.user_id === user_id
    );
    console.log('用户订单', userOrders);
    res.json(userOrders);
  } else {
    // 如果没有提供user_id，则返回所有订单
    console.log('所有订单', normal_orders);
    res.json(normal_orders);
  }
});

// 创建新订单
app.post('/normal_orders', (req, res) => {
  const newOrder = req.body;

  // 验证必要字段
  if (!newOrder.user_id || !newOrder.items || !Array.isArray(newOrder.items)) {
    return res.status(400).json({ error: '缺少必要字段' });
  }

  // 生成订单ID
  newOrder.id = 'O' + (normal_orders.length + 1).toString().padStart(2, '0');

  // 设置创建时间
  newOrder.created_at = new Date().toISOString();

  // 计算总价
  // newOrder.total_price = newOrder.items.reduce((total, item) => {
  //   return total + item.quantity * item.single_price;
  // }, 0);

  // 添加订单
  normal_orders.push(newOrder);
  console.log('添加订单后', normal_orders);
  res.status(201).json(newOrder);
});

// 更新订单状态
app.put('/normal_orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // 查找订单
  const orderIndex = normal_orders.findIndex((order) => order.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: '订单未找到' });
  }

  // 更新订单状态
  normal_orders[orderIndex].status = status;
  console.log('更新订单状态后', normal_orders[orderIndex]);
  res.json(normal_orders[orderIndex]);
});

// 删除订单
app.delete('/normal_orders/:id', (req, res) => {
  const { id } = req.params;

  // 查找订单
  const orderIndex = normal_orders.findIndex((order) => order.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: '订单未找到' });
  }

  // 删除订单
  const deletedOrder = normal_orders.splice(orderIndex, 1);
  console.log('删除订单后', normal_orders);
  res.json(deletedOrder[0]);
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

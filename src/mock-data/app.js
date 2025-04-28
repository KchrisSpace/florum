import express from 'express';
import cors from 'cors';
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
  feedback,
} from './data.js';
import multer from 'multer';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { MongoClient } from 'mongodb';
import fs from 'fs';

const app = express();
const port = 3000;

// 确保上传目录存在
const uploadDirs = [
  './public/uploads',
  './public/uploads/products',
  './public/uploads/avatars',
];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    console.log('创建目录:', dir);
    fs.mkdirSync(dir, { recursive: true });
  }
});

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
    // 根据文件类型选择不同的存储目录
    const dest =
      file.fieldname === 'user_avatar'
        ? './public/uploads/avatars'
        : './public/uploads/products';
    console.log('文件存储目录:', dest);
    console.log('文件信息:', file);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    const prefix = file.fieldname === 'user_avatar' ? 'avatar' : 'product';
    const filename = `${prefix}_${Date.now()}.${ext}`;
    console.log('生成的文件名:', filename);
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    console.log('文件类型检查:', file.mimetype);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  },
});

// 商品图片上传路由
app.post('/uploads', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        message: '没有上传文件',
      });
    }

    res.json({
      code: 200,
      message: '上传成功',
      url: `/uploads/products/${req.file.filename}`,
    });
  } catch (error) {
    console.error('文件上传失败:', error);
    res.status(500).json({
      code: 500,
      message: '文件上传失败',
      error: error.message,
    });
  }
});

// 获取用户列表
app.get('/users', async (req, res) => {
  try {
    const { username, email, status } = req.query;
    const db = client.db(dbName);
    let query = {};

    if (username) {
      query.user_name = { $regex: username, $options: 'i' };
    }
    if (email) {
      query.user_email = { $regex: email, $options: 'i' };
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
    const user = await db.collection('users').findOne({ id });

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
app.put('/users/:id', upload.single('user_avatar'), async (req, res) => {
  try {
    const { id } = req.params;
    console.log('更新用户ID:', id);
    console.log('请求体:', req.body);
    console.log('上传的文件:', req.file);

    const updateData = JSON.parse(req.body.userData || '{}');
    console.log('解析后的更新数据:', updateData);

    const db = client.db(dbName);

    // 如果有文件上传，处理头像
    if (req.file) {
      // 确保文件路径正确
      const avatarPath = `/uploads/avatars/${req.file.filename}`;
      console.log('新的头像路径:', avatarPath);
      updateData.user_avatar = avatarPath;
    }

    // 构建更新对象，只包含提供的字段
    const updateFields = {};
    if (updateData.user_name) updateFields.user_name = updateData.user_name;
    if (updateData.user_gender)
      updateFields.user_gender = updateData.user_gender;
    if (updateData.user_email) updateFields.user_email = updateData.user_email;
    if (updateData.user_phone) updateFields.user_phone = updateData.user_phone;
    if (updateData.user_avatar)
      updateFields.user_avatar = updateData.user_avatar;
    if (updateData.updated_at) updateFields.updated_at = updateData.updated_at;
    if (updateData.status) updateFields.status = updateData.status;
    if (updateData.role_id) updateFields.role_id = updateData.role_id;
    if (updateData.user_password)
      updateFields.user_password = updateData.user_password;

    console.log('最终更新字段:', updateFields);

    // 如果没有要更新的字段，返回错误
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        code: 400,
        message: '没有提供要更新的字段',
        data: null,
      });
    }

    // 更新用户信息
    const result = await db
      .collection('users')
      .findOneAndUpdate(
        { id: id },
        { $set: updateFields },
        { returnDocument: 'after' }
      );

    console.log('更新结果:', result);

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: '用户未找到',
        data: null,
      });
    }

    // 获取更新后的完整用户数据
    const updatedUser = await db.collection('users').findOne({ id: id });
    console.log('更新后的用户数据:', updatedUser);

    // 返回更新后的完整用户数据
    res.json({
      code: 200,
      message: '更新成功',
      data: updatedUser,
    });
  } catch (err) {
    console.error('更新用户失败:', err);
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

    const result = await db.collection('users').findOneAndDelete({ id: id });
    if (!result) {
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

// 删除商品
app.delete('/product_list/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db(dbName);

    const result = await db.collection('product_list').findOneAndDelete({ id });

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: '商品未找到',
        data: null,
      });
    }

    res.json({
      code: 200,
      message: '删除成功',
      data: result,
    });
  } catch (err) {
    console.error('删除商品失败:', err);
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 修改商品信息
app.put('/product_list/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const db = client.db(dbName);

    // 构建更新对象
    const updateFields = {};

    // 基本信息
    if (updateData.title) updateFields.title = updateData.title;
    if (updateData.main_category)
      updateFields.main_category = updateData.main_category;
    if (updateData.images) updateFields.images = updateData.images;

    // 价格信息
    if (updateData.price_info) {
      updateFields.price_info = {
        original_price: updateData.price_info.original_price || 0,
        current_price: updateData.price_info.current_price || 0,
      };
    }

    // 销售数据
    if (updateData.sales_data) {
      updateFields.sales_data = {
        sales_count: updateData.sales_data.sales_count || 0,
        stock_status: updateData.sales_data.stock_status || '充足',
        rating: updateData.sales_data.rating || 0,
      };
    }

    // 促销信息
    if (updateData.promotion) {
      updateFields.promotion = {
        is_hot: updateData.promotion.is_hot || false,
        main_description: updateData.promotion.main_description || '',
        keywords: updateData.promotion.keywords || [],
        flower_language: updateData.promotion.flower_language || '',
        end_time: updateData.promotion.end_time || '',
      };
    }

    // 规格信息
    if (updateData.specification) {
      updateFields.specification = {
        category: updateData.specification.category || [],
        materials: updateData.specification.materials || [],
        packaging: updateData.specification.packaging || '',
      };
    }

    // 状态
    if (updateData.status) updateFields.status = updateData.status;

    // 更新时间
    updateFields.timestamps = {
      updated_at: new Date().toISOString().split('T')[0],
    };

    const result = await db
      .collection('product_list')
      .findOneAndUpdate(
        { id },
        { $set: updateFields },
        { returnDocument: 'after' }
      );

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: '商品未找到',
        data: null,
      });
    }

    res.json({
      code: 200,
      message: '更新成功',
      data: result,
    });
  } catch (err) {
    console.error('更新商品失败:', err);
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    });
  }
});

// 新增商品
app.post('/product_list', async (req, res) => {
  try {
    const newProduct = req.body;
    const db = client.db(dbName);

    // 生成新的商品ID
    const lastProduct = await db
      .collection('product_list')
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    const lastId = lastProduct.length > 0 ? lastProduct[0].id : 'P00';
    const newId =
      'P' + (parseInt(lastId.substring(1)) + 1).toString().padStart(2, '0');

    // 构建新商品对象
    const product = {
      id: newId,
      main_category: newProduct.main_category || '上新',
      images: newProduct.images || [],
      title: newProduct.title || '',
      price_info: {
        original_price: newProduct.price_info?.original_price || 0,
        current_price: newProduct.price_info?.current_price || 0,
      },
      sales_data: {
        sales_count: newProduct.sales_data?.sales_count || 0,
        stock_status: newProduct.sales_data?.stock_status || '充足',
        rating: newProduct.sales_data?.rating || 0,
      },
      promotion: {
        is_hot: newProduct.promotion?.is_hot || false,
        main_description: newProduct.promotion?.main_description || '',
        keywords: newProduct.promotion?.keywords || [],
        flower_language: newProduct.promotion?.flower_language || '',
        end_time: newProduct.promotion?.end_time || '',
      },
      specification: {
        category: newProduct.specification?.category || [],
        materials: newProduct.specification?.materials || [],
        packaging: newProduct.specification?.packaging || '',
      },
      timestamps: {
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
      },
      status: newProduct.status || '上架',
    };

    const result = await db.collection('product_list').insertOne(product);

    res.status(201).json({
      code: 200,
      message: '创建成功',
      data: {
        ...product,
        _id: result.insertedId,
      },
    });
  } catch (err) {
    console.error('创建商品失败:', err);
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

    if (!result) {
      return res.status(404).send('Item not found');
    }

    res.json(result);
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
    console.log('删除购物车商品，ID:', id);

    const db = client.db(dbName);

    if (id === 'clear') {
      await db.collection('cart').deleteMany({});
      res.json({
        code: 200,
        message: '购物车已清空',
        data: null,
      });
    } else {
      // 先检查商品是否存在
      const existingItem = await db.collection('cart').findOne({ id });
      console.log('查询到的商品:', existingItem);

      if (!existingItem) {
        console.log('商品不存在:', id);
        return res.status(404).json({
          code: 404,
          message: '商品不存在',
          data: null,
        });
      }

      // 删除商品
      const result = await db.collection('cart').deleteOne({ id });
      console.log('删除结果:', result);

      if (result.deletedCount === 0) {
        console.log('删除失败，未找到商品:', id);
        return res.status(404).json({
          code: 404,
          message: '商品不存在',
          data: null,
        });
      }

      res.json({
        code: 200,
        message: '删除成功',
        data: existingItem,
      });
    }
  } catch (err) {
    console.error('删除购物车商品失败:', err);
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

    if (!result) {
      return res.status(404).send('Item not found');
    }

    res.json(result);
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
    console.log('删除心愿单商品，ID:', id);

    const db = client.db(dbName);

    // 先检查商品是否存在
    const existingItem = await db.collection('wishlist').findOne({ id });
    console.log('查询到的商品:', existingItem);

    if (!existingItem) {
      console.log('商品不存在:', id);
      return res.status(404).json({
        code: 404,
        message: '商品不存在',
        data: null,
      });
    }

    // 删除商品
    const result = await db.collection('wishlist').deleteOne({ id });
    console.log('删除结果:', result);

    if (result.deletedCount === 0) {
      console.log('删除失败，未找到商品:', id);
      return res.status(404).json({
        code: 404,
        message: '商品不存在',
        data: null,
      });
    }

    res.json({
      code: 200,
      message: '删除成功',
      data: existingItem,
    });
  } catch (err) {
    console.error('删除心愿单商品失败:', err);
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
      return res.status(400).json({
        code: 400,
        message: '缺少 articleId 参数',
        data: null,
      });
    }

    const db = client.db(dbName);
    const comments = await db
      .collection('article_comments')
      .find({ article_id })
      .toArray();

    res.json({
      code: 200,
      message: '获取评论成功',
      data: comments,
    });
  } catch (err) {
    console.error('获取文章评论失败:', err);
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
      data: null,
    });
  }
});

app.post('/article_comments', async (req, res) => {
  try {
    const newComment = req.body;

    // 验证必要字段
    if (!newComment.article_id || !newComment.user_id || !newComment.content) {
      return res.status(400).json({
        code: 400,
        message: '缺少必要字段',
        data: null,
      });
    }

    const db = client.db(dbName);
    const result = await db
      .collection('article_comments')
      .insertOne(newComment);

    if (result.acknowledged) {
      res.status(201).json({
        code: 200,
        message: '评论发布成功',
        data: newComment,
      });
    } else {
      throw new Error('评论发布失败');
    }
  } catch (err) {
    console.error('发布文章评论失败:', err);
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
      data: null,
    });
  }
});

// 商品评论相关接口
app.get('/product_comments', async (req, res) => {
  try {
    const { product_id } = req.query;
    if (!product_id) {
      return res.status(400).json({
        code: 400,
        message: '缺少 productId 参数',
        data: null,
      });
    }

    const db = client.db(dbName);
    const comments = await db
      .collection('product_comments')
      .find({ product_id })
      .toArray();

    res.json({
      code: 200,
      message: '获取评论成功',
      data: comments,
    });
  } catch (err) {
    console.error('获取商品评论失败:', err);
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
      data: null,
    });
  }
});

app.post('/product_comments', async (req, res) => {
  try {
    const newComment = req.body;

    // 验证必要字段
    if (!newComment.product_id || !newComment.user_id || !newComment.content) {
      return res.status(400).json({
        code: 400,
        message: '缺少必要字段',
        data: null,
      });
    }

    const db = client.db(dbName);
    const result = await db
      .collection('product_comments')
      .insertOne(newComment);

    if (result.acknowledged) {
      res.status(201).json({
        code: 200,
        message: '评论发布成功',
        data: newComment,
      });
    } else {
      throw new Error('评论发布失败');
    }
  } catch (err) {
    console.error('发布商品评论失败:', err);
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
      data: null,
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
    // 生成反馈ID
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    const feedbackId = `FEEDBACK${timestamp}${randomNum}`;
    newItem.id = feedbackId;

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

    // 生成地址ID
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    const addressId = `ADDR${timestamp}${randomNum}`;
    newAddress.id = addressId;

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

    // 构建更新对象，确保字段名称与数据库模型一致
    const updateFields = {
      user_id: updateData.user_id,
      consignee: updateData.consignee,
      phone: updateData.phone,
      region: updateData.region,
      detail: updateData.detail,
      is_default: updateData.is_default,
    };

    // 如果设置为默认地址，先将其他地址设为非默认
    if (updateData.is_default) {
      await db
        .collection('addresses')
        .updateMany(
          { user_id: updateData.user_id },
          { $set: { is_default: false } }
        );
    }

    // 使用id字段进行查询和更新
    const result = await db
      .collection('addresses')
      .findOneAndUpdate(
        { id: id },
        { $set: updateFields },
        { returnDocument: 'after' }
      );

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: '地址未找到',
        error: '地址未找到',
      });
    }

    res.json({
      code: 200,
      message: '更新成功',
      data: result,
    });
  } catch (err) {
    console.error('更新地址失败:', err);
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
      .findOneAndDelete({ id: id });

    if (!result) {
      return res.status(404).json({ error: '地址未找到' });
    }

    res.json(result);
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
    // 生成订单ID
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    const orderId = `ORDER${timestamp}${randomNum}`;
    newOrder.id = orderId;
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
        { id: id },
        { $set: { status } },
        { returnDocument: 'after' }
      );

    if (!result) {
      return res.status(404).json({ error: '订单未找到' });
    }

    res.json(result);
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
      .findOneAndDelete({ id: id });

    if (!result) {
      return res.status(404).json({ error: '订单未找到' });
    }

    res.json(result);
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
    // 生成定制ID
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    const customId = `CUSTOM${timestamp}${randomNum}`;
    newCustom.id = customId;
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
// 更改定制信息接口
app.put('/custom/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const db = client.db(dbName);

    // 只允许更新部分字段
    const allowedFields = [
      'user_id',
      'custom_img',
      'email',
      'phone',
      'custom_message',
      'status'
    ];
    const setData = {};
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) setData[field] = updateData[field];
    });
    setData.updated_at = new Date().toISOString();

    // 检查是否有可更新字段
    if (Object.keys(setData).length === 1) {
      return res.status(400).json({ code: 400, message: '没有可更新字段' });
    }

    // 先尝试用id字段查找
    let result = await db
      .collection('custom')
      .findOneAndUpdate(
        { id },
        { $set: setData },
        { returnDocument: 'after' }
      );


    if (!result) {
      return res.status(404).json({ code: 404, message: '未找到该定制信息' });
    }

    res.json({
      code: 200,
      message: '更新成功',
      data: result,
    });
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

// 配置静态文件服务
app.use('/uploads', express.static('public/uploads'));

// 启动服务器
connectToMongo().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

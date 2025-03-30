require('dotenv').config();
const jsonServer = require('json-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Configuración desde .env con valores por defecto
const CONFIG = {
  JWT: {
    SECRET: process.env.JWT_SECRET || 'shopease_dev_secret_2024',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '2h',
    COOKIE_NAME: process.env.TOKEN_COOKIE_NAME || 'shopEase_token'
  },
  SERVER: {
    PORT: process.env.PORT || 3000,
    ENV: process.env.NODE_ENV || 'development',
    CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:4200']
  },
  DB: {
    TYPE: process.env.DB_TYPE || 'json',
    JSON_PATH: process.env.JSON_DB_PATH || './db.json'
  }
};

// Inicialización
const server = jsonServer.create();
const router = jsonServer.router(CONFIG.DB.JSON_PATH);
const middlewares = jsonServer.defaults();

// 1. Configuración de CORS
server.use(cors({
  origin: CONFIG.SERVER.CORS_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  credentials: true
}));

// 2. Middlewares base
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Helper para omitir campos sensibles
function omit(obj, ...keys) {
  return keys.reduce((acc, key) => {
    const { [key]: _, ...rest } = acc;
    return rest;
  }, obj);
}

// ==================== Endpoints de Autenticación ====================

// Login
server.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    const user = router.db.get('users').find({ username }).value();
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      CONFIG.JWT.SECRET,
      { expiresIn: CONFIG.JWT.EXPIRES_IN }
    );

    res.cookie(CONFIG.JWT.COOKIE_NAME, token, {
      httpOnly: true,
      secure: CONFIG.SERVER.ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      expiresIn: 7200
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
});

// Registro
server.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone } = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    if (router.db.get('users').find({ username }).value()) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      id: Date.now(),
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: 'customer',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    router.db.get('users').push(newUser).write();

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      CONFIG.JWT.SECRET,
      { expiresIn: CONFIG.JWT.EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      token,
      user: omit(newUser, 'password'),
      expiresIn: 7200
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el registro' 
    });
  }
});

// Verificación de username
server.post('/api/auth/check-username', (req, res) => {
  const { username } = req.body;
  const exists = router.db.get('users').find({ username }).value();
  res.json({ available: !exists });
});

// Verificación de email
server.post('/api/auth/check-email', (req, res) => {
  const { email } = req.body;
  const exists = router.db.get('users').find({ email }).value();
  res.json({ available: !exists });
});

// ==================== Middlewares de Seguridad ====================

// Autenticación JWT
server.use(/^\/api\/(?!auth).*/, (req, res, next) => {
  try {
    const token = req.cookies?.[CONFIG.JWT.COOKIE_NAME] || 
                 req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Token de autorización requerido' 
      });
    }

    req.user = jwt.verify(token, CONFIG.JWT.SECRET);
    next();

  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({ 
      success: false,
      message: 'Token inválido o expirado' 
    });
  }
});

// Autorización de Admin
server.use('/api/users', (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Se requieren privilegios de administrador'
    });
  }
  next();
});

// ==================== Montar JSON Server ====================
// ¡IMPORTANTE! Esto debe ir AL FINAL para no interferir con rutas personalizadas
server.use('/api', router);

// Manejador de errores global
server.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
server.listen(CONFIG.SERVER.PORT, () => {
  console.log(`
  🚀 Servidor ShopEase iniciado en modo ${CONFIG.SERVER.ENV}
  🔗 URL: http://localhost:${CONFIG.SERVER.PORT}
  🔐 Auth: POST http://localhost:${CONFIG.SERVER.PORT}/api/auth/{login|register|check-username|check-email}
  📦 API: GET http://localhost:${CONFIG.SERVER.PORT}/api/users
  `);
  
  if (CONFIG.SERVER.ENV === 'development') {
    console.warn('⚠️  ADVERTENCIA: Usando configuración de desarrollo - No apto para producción');
  }
});
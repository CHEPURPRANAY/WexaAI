const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../utils/jwtUtils');

const signup = async (req, res) => {
  try {
    const { email, password, organizationName } = req.body;

    // Check if user already exists
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create organization
    const [orgResult] = await db.query(
      'INSERT INTO organizations (name) VALUES (?)',
      [organizationName]
    );

    const organizationId = orgResult.insertId;

    // Create user
    const [userResult] = await db.query(
      'INSERT INTO users (email, password, organization_id) VALUES (?, ?, ?)',
      [email, hashedPassword, organizationId]
    );

    const userId = userResult.insertId;

    // Create default settings for organization
    await db.query(
      'INSERT INTO settings (organization_id, default_low_stock_threshold) VALUES (?, ?)',
      [organizationId, 5]
    );

    // Generate JWT token
    const token = generateToken({ 
      id: userId, 
      email, 
      organizationId 
    });

    // Get user details for response
    const [newUser] = await db.query(
      'SELECT u.id, u.email, u.organization_id, o.name as organization_name FROM users u JOIN organizations o ON u.organization_id = o.id WHERE u.id = ?',
      [userId]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: newUser[0],
        token
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with organization
    const [users] = await db.query(
      'SELECT u.id, u.email, u.password, u.organization_id, o.name as organization_name FROM users u JOIN organizations o ON u.organization_id = o.id WHERE u.email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      organizationId: user.organization_id 
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT u.id, u.email, u.organization_id, o.name as organization_name FROM users u JOIN organizations o ON u.organization_id = o.id WHERE u.id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: users[0]
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  signup,
  login,
  getMe
};

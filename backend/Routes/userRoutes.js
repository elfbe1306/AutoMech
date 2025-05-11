const express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../config.env' });

router.post('/Users', async (request, response) => {
  const supabase = request.supabase;
  const { email, password } = request.body;
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return response.status(400).json({ message: error.message });
  response.status(201).json({ 
    message: 'Đã thành công tạo tài khoản', 
    user: data.user,
  });
});

router.post('/Users/Login', async (request, response) => {
  const supabase = request.supabase;
  const { email, password } = request.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  const token = jwt.sign(data.user, process.env.SECRET_KEY, {expiresIn: "1h"})

  if (error) return response.status(400).json({ message: error.message });
  response.status(200).json({
    message: 'Đăng nhập thành công',
    token: token,
  });
});

router.get('/getuser/:userid', async (request, response) => {
  try {
    const supabase = request.supabase;
    const decoded = jwt.verify(request.params.userid, process.env.SECRET_KEY);
    const email = decoded.email;

    // Lấy data từ user
    const { data: userData, error: userDataError } = await supabase.from('User').select('*').eq('email', email);
    if (userDataError) {
      console.error("userDataError", userDataError)
      return response.status(400).json({ message: userDataError.message });
    }

    response.status(200).json({ userData: userData[0] });
  } catch (error) {
    response.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;

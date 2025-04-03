import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(form)).unwrap();
      setErrors({}); // Clear previous errors
      window.alert('Login successful! Redirecting to home page...');
      navigate('/');
    } catch (err) {
      setErrors({ apiError: err?.error || 'Failed to register' });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mt-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <div className="h-6">
          {errors.apiError && (
            <p className="text-red-500 text-sm text-center">
              {errors.apiError}
            </p>
          )}
        </div>
        <button className="bg-green-500 text-white p-2 w-full mt-2">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

import { useState } from "react"
import axios from 'axios'
import {toast} from 'react-hot-toast'

export default function Register({ onBackToLogin }) {
    const [data, setData] = useState({
        username: '',
        email: '',
        password: '',
    })

    const registerUser = async (e) => {
        e.preventDefault()
        const {username, email, password} = data
        
        // Validation
        if (!username || !email || !password) {
            toast.error('All fields are required');
            return;
        }
        
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        
        if (username.length < 3) {
            toast.error('Username must be at least 3 characters');
            return;
        }

        try {
            console.log('Making registration request to /api/auth/register');
            const response = await axios.post('/api/auth/register', {
                username, email, password
            })
            console.log('Registration response:', response.data);
            if(response.data.error){
                toast.error(response.data.error)
            }
            else {
                setData({})
                toast.success('Registration successful! Please sign in with your new account.')
                onBackToLogin()
            }
        } catch (error) {
            console.error('Registration error details:', error);
            console.error('Error response:', error.response);
            console.error('Error message:', error.message);
            toast.error('Network error. Please try again.');
        }
    }

    const handleInputChange = (field, value) => {
        console.log('Input change:', field, value);
        setData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="register-container">
            <div className="register-header">
                <h2>Create Account</h2>
                <button onClick={onBackToLogin} className="back-btn">
                    ← Back to Login
                </button>
            </div>
            
            <form onSubmit={registerUser} className="register-form">
                <div className="input-group">
                    <label>Username</label>
                    <input 
                        type='text' 
                        placeholder='Choose a username' 
                        value={data.username} 
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        required 
                    />
                    <div className="input-border"></div>
                </div>
                
                <div className="input-group">
                    <label>Email Address</label>
                    <input 
                        type='email' 
                        placeholder='Enter your email' 
                        value={data.email} 
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required 
                    />
                    <div className="input-border"></div>
                </div>
                
                <div className="input-group">
                    <label>Password</label>
                    <input 
                        type='password' 
                        placeholder='Create a password (min 8 characters)' 
                        value={data.password} 
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required 
                    />
                    <div className="input-border"></div>
                </div>
                
                <button type="submit" className="primary-btn">
                    <span>Create Account</span>
                    <div className="button-glow"></div>
                </button>
            </form>
        </div>
    )
}
import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/frontend_assets/assets'

const LoginPopup = ({setShowLogin}) => {

    const [currState, setCurrState] = useState('Login')
    const [data, setData] = useState({
        name: "",
        student_id: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(data=>({...data, [name]: value}))
    }

    // useEffect(() => {
    //     console.log(data) // This will log the data object whenever it changes
    // }, [data])

  return (
    <div className='login-popup'>
        <form  className="login-popup-container">
            <div className="login-popup-title">
                <h2>{currState}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-inputs">
            {currState === 'Login' ? (
                <></> // Render nothing when currState is 'Login'
                ) : (
                <>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder="Your name" required />
                    <input name='student-id' onChange={onChangeHandler} value={data.student_id} type="text" placeholder="Student Id" required />
                </>
                )}

                <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required/>
                <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Your password' required />
            </div>
            <button>{currState==='Sign Up'?'Create account':'Login'}</button>
            {currState === 'Sign Up'?<div className="login-popup-condition">
                <input type="checkbox" required />
                <p>By continuing, I agree to the terms of us & privacy policy.</p>
            </div>:<></>}
            {currState==='Login'
            ?<p>Create a new account? <span onClick={()=>setCurrState('Sign Up')}>Click here</span></p>
            :
            <p>Already have an account? <span onClick={()=>setCurrState('Login')}>Login here</span></p>       
            }
        </form>
    </div>
  )
}

export default LoginPopup

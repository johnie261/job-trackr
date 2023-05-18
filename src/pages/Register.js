import React, { useState } from 'react'
import Wrapper from '../assets/wrappers/RegisterPage'
import { Logo, FormRow } from '../components'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { LoginUser, RegisterUser } from '../features/users/userSlice'

const Register = () => {

  const {user, isLoading} = useSelector((store) => store.user)
  const dispatch = useDispatch()
  
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    isMember: true,
  })

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setValues({ ...values, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const {name, email, password, isMember} = values
    if(!email || !password || (!isMember && !name)){
    toast.error("Please fill in all fields")
    return
    }
    if(isMember){
      dispatch(LoginUser({email, password}))
      return
    }
    dispatch(RegisterUser({name, email, password}))
  }

  const toggleButton = () => {
    setValues({...values, isMember: !values.isMember})
  }

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={handleSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {!values.isMember && 
          <FormRow name='name' text='text' value={values.name} handleChange={handleChange}/>
        }
        <FormRow name='email' text='email' value={values.email} handleChange={handleChange}/>
        <FormRow name='password' text='password' value={values.password} handleChange={handleChange}/>

      <button className="btn btn-block">
        submit
      </button>

      <p>
        {values.isMember ? 'Not yet a Member?' : 'Already a Member?'}
        <button type='button' onClick={toggleButton} className='member-btn' disabled={isLoading}>
          {values.isMember ? 'Register' : 'Login'}
        </button>
      </p>
      </form>
    </Wrapper>
  )
}

export default Register
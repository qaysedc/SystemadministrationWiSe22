import React, { useState, useContext } from 'react'
import { AppContext } from '../App'
import {
  FaBars,
  FaRegComment,
  FaRobot,
  FaTerminal,
  FaTh, FaUserAlt,
} from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

export default function Sidebar({children}) {
  const { ros } = useContext(AppContext)
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

  let menuItem = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <FaTh />
    },
    {
      path: '/about',
      name: 'About',
      icon: <FaUserAlt />
    },
    {
      path: '/robots',
      name: 'Robots',
      icon: <FaRobot />
    }
  ]
    ros?.map((item, index) => (
      menuItem.push({
        path: '/topics'+index,
        name: "Topics Robot "+(index+1),
        icon: <FaRegComment />
      })
  ))
  
  return (
    <div className='containerBox'>
      <div style={{width: isOpen ? '200px' : '50px'}} className='sidebar'>
        <div className='top_section'>
          <h1 style={{display: isOpen ? 'block' : 'none'}} className='logo'>Logo</h1>
          <div style={{marginLeft: isOpen ? '50px' : '0px'}} className='bars'>
            <FaBars onClick={toggle} />
          </div>
        </div>
        {
          menuItem.map((item, index) => (
            <NavLink to={item.path} key={index} className='link' activeclassname="active">
              <div className='icon'>{item.icon}</div>
              <div style={{display: isOpen ? 'block' : 'none'}} className='link_text'>{item.name}</div>
            </NavLink>
          ))
        }
      </div>
        <main>{children}</main>
    </div>
  )
}

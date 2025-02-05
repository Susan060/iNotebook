import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import NoteContext from '../Context/notes/NoteContext'

export default function About() {
  const a=useContext(NoteContext)
  useEffect(()=>
  {
    a.update()
    // eslint-disable-next-line
  },[])
  return (
    <div>
      This is about {a.state.name} and he is in {a.state.class}
    </div>
  )
}

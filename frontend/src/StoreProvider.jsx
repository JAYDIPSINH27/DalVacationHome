import React from 'react'

export const StoreContext = React.createContext()

const StoreProvider = (props) => {
  const initialState = {
    f_name: '',
    l_name: '',
    email: '',
  }
  const [state, setState] = React.useState(initialState)
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }
  return (
    <StoreContext.Provider value={{
      state,
      updateState,
    }}>{props.children}</StoreContext.Provider>
  )
}

export default StoreProvider
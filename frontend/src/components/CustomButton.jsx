import styled from '@emotion/styled'
import { Button } from '@mui/material'
import React from 'react'

const StyledButton = styled(Button)`
    text-transform: none;
`

const CustomButton = (props) => {
  return (
    <StyledButton disableElevation {...props}>{props.children}</StyledButton>
  )
}

export default CustomButton
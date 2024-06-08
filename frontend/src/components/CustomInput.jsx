import styled from "@emotion/styled";
import {
    TextField,
} from "@mui/material";
import React from "react";

const StyledTextField = styled(TextField)`
    label {
        position: relative;
        transform: none;
    }
    & .MuiFormHelperText-root {
      margin-left: 0;
    }
`;

const CustomInput = (props) => {
    return (
        <StyledTextField
            InputLabelProps={{
                shrink: false,
            }}
            fullWidth
            size="small"
            {...props}
        />
    );
};

export default CustomInput;

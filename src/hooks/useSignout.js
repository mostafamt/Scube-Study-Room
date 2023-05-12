import React ,{useState, useEffect} from "react";
import jwt_decode ,{errors} from "jwt-decode";
import config from '../config'
const useSignout= ()=>{
    const tokenName= `datahub-token-${config.cognito.APP_CLIENT_ID}`;
    const clear=()=>{
        localStorage.getItem(tokenName)
        if (token){
            localStorage.removeItem(tokenName)
        }
        window.location = config.cognito.SIGNOUT_URL;
    }
    useEffect(()=>{
        clear()
    });
    return ;
}




export default useSignout;

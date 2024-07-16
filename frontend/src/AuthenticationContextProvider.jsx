import React, { createContext, useEffect, useRef, useState } from 'react'
import { getUserPool } from './CognitoHelper';

export const AuthenticationContext = createContext()
const AuthenticationContextProvider = (props) => {
    const userAttributesMap = useRef({});
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(null);
    const userSessionRef = useRef(null);
    
    useEffect(() => {
        const userpool = getUserPool();
        const user = userpool.getCurrentUser();
        if(!user) {
            setLoading(false);
            return;
        }
        setUserName(user.username);
        user?.getSession((error, session) => {
            if (error) {
                console.error(error);
            } else {
                if (session.isValid()) {
                    userSessionRef.current = session;
                    console.log("Session is valid", session);
                    user.getUserAttributes((err, result) => {
                        if (err) {
                            console.error(err);
                        } else {
                            userAttributesMap.current  = result.reduce((acc, attr) => {
                                acc[attr.getName()] = attr.getValue();
                                return acc;
                            }, {});
                            const role = userAttributesMap.current["custom:role"];
                            setUserRole(role);
                            setLoading(false);
                            
                        }
                    });
                } else {
                    setLoading(true);
                    console.log("Session is not valid");
                }
            }
        });
    }, []);
  return (
    <AuthenticationContext.Provider value={{userAttributesMap, loading, userRole, userName, userSessionRef}}>{props.children}</AuthenticationContext.Provider>
  )
}

export default AuthenticationContextProvider
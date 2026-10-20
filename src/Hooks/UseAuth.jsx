import React, { use } from 'react';
import { AuthContext } from '../Provider/AuthContext';

const UseAuth = () => {
    const authInfo=use(AuthContext);
        return authInfo;
};

export default UseAuth;
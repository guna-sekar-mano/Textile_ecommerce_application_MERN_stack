const tokenkey="EXTREMECULTURESEC2025";

const gettoken=()=>{
  const token=localStorage.getItem(tokenkey);
  return token;
}

const isLoggedIn=()=>{
  return gettoken()?true:false;
}

const settoken=(token)=>{
  return localStorage.setItem(tokenkey,token);
}

const getuserdetails = () => {
  var token = gettoken();
  
  if (gettoken() != null) {
    try{
      var userData = JSON.parse(window.atob(token.split(".")[1]));
      return userData;
    } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
  }
  else {
    return null;
  }
};

const removetoken = () => {
  localStorage.removeItem(tokenkey);
  localStorage.removeItem('cart-storage');
  return;
};


export {gettoken,isLoggedIn,settoken,getuserdetails,removetoken};
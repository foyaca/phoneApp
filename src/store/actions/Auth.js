import { SET_TOKEN, SET_EMAIL, SET_PASSWORD, REMOVE_TOKEN, REMOVE_EMAIL, REMOVE_PASSWORD, SET_DOMAIN, REMOVE_DOMAIN} from './actionTypes'

export const setToken = (token) => {
  return {
    type: SET_TOKEN,
    token: token 
  }
}
export const removeToken = () => {
  return {
    type: REMOVE_TOKEN
  }
}

export const setEmail = (email) => {
  return {
    type: SET_EMAIL,
    email: email
  }
}
export const removeEmail = (email) => {
  return {
    type: REMOVE_EMAIL
  }
}

export const setPassword = (password) => {
  return {
    type: SET_PASSWORD,
    password: password
  }
}

export const removePassword = (password) => {
  return {
    type: REMOVE_PASSWORD
  }
}
  
export const setDomain = (domain) => {
  return {
    type: SET_DOMAIN,
    domain: domain
  }
}
export const removeDoamin = () => {
  return {
    type: REMOVE_DOMAIN
  }
}

// notificationReducer.js
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    displayNotification: (state, action) => action.payload,
    clearNotification: () => ''
  }
});


let timerId;

export const setNotification = (content, time) => {
  return async dispatch => {
    if (timerId) {
      clearTimeout(timerId);
    }

    dispatch(displayNotification(content));

    timerId = setTimeout(() => {
      dispatch(clearNotification());
    }, time * 1000); 
  };
};


export const { displayNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

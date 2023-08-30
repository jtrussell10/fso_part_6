import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'


const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    updateAnecdoteVotes: (state, action) => {
      const id = action.payload.id;
      const anecdoteToUpdate = state.find(anecdote => anecdote.id === id);
      if (anecdoteToUpdate) {
        anecdoteToUpdate.votes = action.payload.votes;
      }
    }
  },
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const likeAnecdote = contentId => {
  return async (dispatch, getState) => {
    const state = getState().anecdotes;
    const anecdoteToChange = state.find(n => n.id === contentId.id);
    const currentVotes = anecdoteToChange.votes;
    const changedAnecdote = { 
      ...anecdoteToChange, 
      votes: currentVotes + 1 
    };

    await anecdoteService.updateAnecdote(changedAnecdote, contentId.id);

    dispatch(updateAnecdoteVotes(changedAnecdote));
  };
}



export const {appendAnecdote, setAnecdotes, updateAnecdoteVotes} = anecdoteSlice.actions
export default anecdoteSlice.reducer
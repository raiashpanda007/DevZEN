import { createSlice } from "@reduxjs/toolkit";
import { Template } from '@workspace/types'

const initalState: Template[] = [
    {
        name: 'Node JS',
        id: '1',
        image: 'node-js.svg',
    }, 
    {
        name: 'React JS',
        id: '2',
        image: 'react.svg',
    }, 
    {
        name: 'React with TypeScript',
        id: '3',
        image: 'react.svg',

    }, 
    {
        name: 'Node JS with TypeScript',
        id: '4',
        image: 'node-js.svg',

    }, 
    {
        name: 'C++',
        id: '5',
        image: 'cpp.svg',
    },
    {
        name: 'Python',
        id: '6',
        image: 'python.svg',
    },
    {
        name: 'Python with Django',
        id: '7',
        image: 'django.svg',
    }

]

const Templates = createSlice({
    name: 'templates',
    initialState: initalState,
    reducers: {}
})

export default Templates.reducer

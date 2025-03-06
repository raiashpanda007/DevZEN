import { createSlice } from "@reduxjs/toolkit";
import { Template } from '@workspace/types'

const initalState: Template[] = [
    {
        name: 'Node JS',
        id: 'NODE_JS',
        image: 'node-js.svg',
    }, 
    {
        name: 'React JS',
        id: 'REACT_JS',
        image: 'react.svg',
    }, 
    {
        name: 'React with TypeScript',
        id: 'REACT_TYPESCRIPT',
        image: 'react.svg',

    }, 
    {
        name: 'Node JS with TypeScript',
        id: 'NODE_JS_TYPESCRIPT',
        image: 'typescript.svg',

    }, 
    {
        name: 'C++',
        id: 'CPP',
        image: 'cpp.svg',
    },
    {
        name: 'Python',
        id: 'PYTHON',
        image: 'python.svg',
    },
    {
        name: 'Python with Django',
        id: 'PYTHON_DJANGO',
        image: 'django.svg',
    },
    {
        name:'NextJS with TypeScript',
        id: 'NEXT_JS',
        image: 'next.svg',
    },{
        name: 'Next with TurboRepo',
        id: 'NEXT_JS_TURBO',
        image: 'next.svg',
    }

]

const Templates = createSlice({
    name: 'templates',
    initialState: initalState,
    reducers: {}
})

export default Templates.reducer

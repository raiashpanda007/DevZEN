import { createSlice } from "@reduxjs/toolkit";
import { Template } from '@workspace/types'

const initalState: Template[] = [
    {
        name: 'Node JS',
        id: 'node_js',
        image: 'node-js.svg',
    }, 
    {
        name: 'React JS',
        id: 'react_js',
        image: 'react.svg',
    }, 
    {
        name: 'React with TypeScript',
        id: 'react_typescript',
        image: 'react.svg',
    }, 
    {
        name: 'Node JS with TypeScript',
        id: 'node_js_typescript',
        image: 'typescript.svg',
    }, 
    {
        name: 'C++',
        id: 'cpp',
        image: 'cpp.svg',
    },
    {
        name: 'Python',
        id: 'python',
        image: 'python.svg',
    },
    {
        name: 'Python with Django',
        id: 'python_django',
        image: 'django.svg',
    },
    {
        name:'NextJS with TypeScript',
        id: 'next_js',
        image: 'next.svg',
    },{
        name: 'Next with TurboRepo',
        id: 'next_js_turbo',
        image: 'next.svg',
    }
]

const Templates = createSlice({
    name: 'templates',
    initialState: initalState,
    reducers: {}
})

export default Templates.reducer
